import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ImageOff,
} from 'lucide-react'
import { supabase } from '../../../api/supabase.js'
import { navigateWithTransition } from '../../../utils/viewTransition.js'
import FeedPost from './FeedPost.jsx'
import FeedPostModal from './FeedPostModal.jsx'
import './index.scss'

const POST_SELECT_WITH_IMAGES = `
  id,
  user_id,
  body,
  image_url,
  image_path,
  images,
  image_paths,
  created_at
`

const POST_SELECT_BASE = `
  id,
  user_id,
  body,
  image_url,
  image_path,
  created_at
`

function isMissingPostImagesColumnError(error) {
  const message = `${error?.message || ''} ${error?.details || ''}`.toLowerCase()

  return error?.code === '42703'
    || message.includes('images')
    || message.includes('image_paths')
}

function isMissingLikesTableError(error) {
  return error?.code === '42P01'
    || error?.code === 'PGRST205'
    || error?.message?.toLowerCase().includes('profile_post_likes')
}

function formatRelativeTime(createdAt) {
  if (!createdAt) return ''

  const seconds = Math.max(Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000), 0)
  if (seconds < 60) return `${seconds}s`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(createdAt))
}

function compactNumber(value = 0) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function getPostImages(post) {
  if (Array.isArray(post?.images) && post.images.length > 0) {
    return post.images.filter(Boolean)
  }

  return post?.image_url ? [post.image_url] : []
}

function normalizePosts(data, profiles = []) {
  const profilesById = profiles.reduce((items, profile) => {
    items[profile.id] = profile
    return items
  }, {})

  return (data || []).map((post) => ({
    ...post,
    author: {
      id: post.user_id,
      name: profilesById[post.user_id]?.uname || 'User',
      avatar: profilesById[post.user_id]?.avatar || '',
    },
    images: Array.isArray(post.images) && post.images.length > 0
      ? post.images
      : post.image_url
        ? [post.image_url]
        : [],
  }))
}

async function fetchPostProfiles(posts) {
  const userIds = [...new Set((posts || []).map((post) => post.user_id).filter(Boolean))]

  if (userIds.length === 0) return []

  const { data, error } = await supabase
    .from('user_profiles')
    .select('id,uname,avatar')
    .in('id', userIds)

  if (error) return []

  return data || []
}

function applyPostLikes(posts, likeRows = [], currentUserId = '') {
  const likesByPost = likeRows.reduce((counts, row) => {
    counts[row.post_id] = (counts[row.post_id] || 0) + 1
    return counts
  }, {})

  return posts.map((post) => ({
    ...post,
    likes_count: likesByPost[post.id] || 0,
    liked_by_user: likeRows.some((row) => row.post_id === post.id && row.user_id === currentUserId),
  }))
}

async function fetchRecentPosts() {
  const withImages = await supabase
    .from('profile_posts')
    .select(POST_SELECT_WITH_IMAGES)
    .order('created_at', { ascending: false })
    .limit(40)

  if (!withImages.error) {
    const profiles = await fetchPostProfiles(withImages.data)
    return { data: normalizePosts(withImages.data, profiles), error: null }
  }

  if (!isMissingPostImagesColumnError(withImages.error)) {
    return { data: [], error: withImages.error }
  }

  const base = await supabase
    .from('profile_posts')
    .select(POST_SELECT_BASE)
    .order('created_at', { ascending: false })
    .limit(40)

  const profiles = await fetchPostProfiles(base.data)

  return { data: normalizePosts(base.data, profiles), error: base.error }
}

function HeroPage() {
  const navigate = useNavigate()
  const [currentUserId, setCurrentUserId] = useState('')
  const [posts, setPosts] = useState([])
  const [newPostCount, setNewPostCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [supportsLikes, setSupportsLikes] = useState(true)
  const [likingPostId, setLikingPostId] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [selectedPostImageIndex, setSelectedPostImageIndex] = useState(0)
  const [status, setStatus] = useState('')

  const newestPostCreatedAt = useMemo(() => posts[0]?.created_at || '', [posts])

  const loadFeed = async () => {
    setIsLoading(true)
    setStatus('')

    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id || ''
    const postsResult = await fetchRecentPosts()

    let nextPosts = postsResult.data || []
    let likesSupported = true

    if (nextPosts.length > 0) {
      const { data: likeData, error: likeError } = await supabase
        .from('profile_post_likes')
        .select('post_id,user_id')
        .in('post_id', nextPosts.map((post) => post.id))

      if (likeError && isMissingLikesTableError(likeError)) {
        likesSupported = false
      } else if (likeError) {
        setStatus(likeError.message)
      } else {
        nextPosts = applyPostLikes(nextPosts, likeData || [], userId)
      }
    }

    if (postsResult.error) setStatus(postsResult.error.message || 'Could not load the feed.')

    setCurrentUserId(userId)
    setSupportsLikes(likesSupported)
    setPosts(nextPosts)
    setNewPostCount(0)
    setIsLoading(false)
  }

  const checkForNewPosts = useCallback(async () => {
    if (!newestPostCreatedAt) return

    const { count, error } = await supabase
      .from('profile_posts')
      .select('id', { count: 'exact', head: true })
      .gt('created_at', newestPostCreatedAt)

    if (!error) setNewPostCount(count || 0)
  }, [newestPostCreatedAt])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadFeed()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (!newestPostCreatedAt) return undefined

    const intervalId = window.setInterval(() => {
      checkForNewPosts()
    }, 30000)

    const timeoutId = window.setTimeout(() => {
      checkForNewPosts()
    }, 0)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [checkForNewPosts, newestPostCreatedAt])

  const navigateToProfile = (userId) => {
    if (!userId) return

    navigateWithTransition(
      navigate,
      userId === currentUserId ? '/profile' : `/profile/${userId}`,
      'fade',
    )
  }

  const handleToggleLike = async (post) => {
    if (!currentUserId) {
      navigateWithTransition(navigate, '/login', 'fade')
      return
    }

    if (!supportsLikes) {
      setStatus('Likes need the profile_post_likes table migration in Supabase first.')
      return
    }

    setLikingPostId(post.id)
    setStatus('')

    try {
      if (post.liked_by_user) {
        const { error } = await supabase
          .from('profile_post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', currentUserId)

        if (error) throw error

        setPosts((current) => current.map((item) => (
          item.id === post.id
            ? { ...item, liked_by_user: false, likes_count: Math.max((item.likes_count || 0) - 1, 0) }
            : item
        )))
        setSelectedPost((current) => (
          current?.id === post.id
            ? { ...current, liked_by_user: false, likes_count: Math.max((current.likes_count || 0) - 1, 0) }
            : current
        ))
      } else {
        const { error } = await supabase
          .from('profile_post_likes')
          .insert({ post_id: post.id, user_id: currentUserId })

        if (error) throw error

        setPosts((current) => current.map((item) => (
          item.id === post.id
            ? { ...item, liked_by_user: true, likes_count: (item.likes_count || 0) + 1 }
            : item
        )))
        setSelectedPost((current) => (
          current?.id === post.id
            ? { ...current, liked_by_user: true, likes_count: (current.likes_count || 0) + 1 }
            : current
        ))
      }
    } catch (error) {
      if (isMissingLikesTableError(error)) {
        setSupportsLikes(false)
        setStatus('Likes need the profile_post_likes table migration in Supabase first.')
        return
      }

      setStatus(error.message || 'Could not update this like.')
    } finally {
      setLikingPostId(null)
    }
  }

  const openPostModal = (post, imageIndex = 0) => {
    setSelectedPost(post)
    setSelectedPostImageIndex(imageIndex)
  }

  const moveSelectedPostImage = (direction) => {
    if (!selectedPost) return

    const imageCount = getPostImages(selectedPost).length
    setSelectedPostImageIndex((current) => (current + direction + imageCount) % imageCount)
  }

  return (
    <main className="home-feed-page">
      <section className="home-feed-shell" aria-label="Recent posts feed">
        <header className="feed-tabs">
          <div className="feed-tab-list">
            <button className="active" type="button">Recents</button>
            <button type="button">Following</button>
          </div>
        </header>

        {newPostCount > 0 && (
          <button className="feed-refresh" type="button" onClick={loadFeed}>
            Show new {newPostCount} recent {newPostCount === 1 ? 'post' : 'posts'}
          </button>
        )}

        {status && <p className="feed-status" role="status">{status}</p>}

        <div className="feed-posts">
          {!isLoading && posts.length === 0 ? (
            <div className="feed-empty">
              <ImageOff />
              <p>No posts yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <FeedPost
                compactNumber={compactNumber}
                formatRelativeTime={formatRelativeTime}
                getPostImages={getPostImages}
                key={post.id}
                likingPostId={likingPostId}
                navigateToProfile={navigateToProfile}
                onOpenPost={openPostModal}
                onToggleLike={handleToggleLike}
                post={post}
              />
            ))
          )}
        </div>
      </section>

      {selectedPost && (
        <FeedPostModal
          compactNumber={compactNumber}
          formatRelativeTime={formatRelativeTime}
          getPostImages={getPostImages}
          imageIndex={selectedPostImageIndex}
          likingPostId={likingPostId}
          navigateToProfile={navigateToProfile}
          onClose={() => setSelectedPost(null)}
          onMoveImage={moveSelectedPostImage}
          onToggleLike={handleToggleLike}
          post={selectedPost}
        />
      )}
    </main>
  )
}

export default HeroPage