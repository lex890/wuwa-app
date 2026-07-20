import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  Heart,
  ImagePlus,
  Loader2,
  MoreHorizontal,
  Pencil,
  Pin,
  Send,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import './Profile.scss'
import { supabase } from '../../../api/supabase.js'
import { navigateWithTransition } from '../../../utils/viewTransition.js'
import defaultBanner from '../../../assets/webp/T_Loadingbg.webp'
import avatarFallback from '../../../assets/svg/star.png'

const PROFILE_BUCKET = 'profile-media'
const BANNER_CROP_ASPECT = 3
const BANNER_OUTPUT_WIDTH = 1500
const BANNER_OUTPUT_HEIGHT = 500
const AVATAR_CROP_ASPECT = 1
const AVATAR_OUTPUT_SIZE = 600
const POST_SELECT_WITH_PINNED = 'id,user_id,body,image_url,image_path,images,image_paths,created_at,pinned'
const POST_SELECT_WITH_IMAGES = 'id,user_id,body,image_url,image_path,images,image_paths,created_at'
const POST_SELECT_BASE = 'id,user_id,body,image_url,image_path,created_at'

function formatJoinedDate(createdAt) {
  if (!createdAt) return 'Joined recently'

  return `Joined ${new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(createdAt))}`
}

function formatPostDate(createdAt) {
  if (!createdAt) return ''

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(createdAt))
}

function getFileExtension(file) {
  return file.name.split('.').pop()?.toLowerCase() || 'jpg'
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new window.Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not load the selected image.'))
    image.src = url
  })
}

function clampCropSource(value, size, maxSize) {
  if (size >= maxSize) return 0
  return Math.min(Math.max(value, 0), maxSize - size)
}

async function cropMediaToFile({ imageUrl, imageElement, cropElement, outputWidth, outputHeight, filePrefix }) {
  const image = await loadImage(imageUrl)
  const imageRect = imageElement.getBoundingClientRect()
  const cropRect = cropElement.getBoundingClientRect()
  const scaleX = image.naturalWidth / imageRect.width
  const scaleY = image.naturalHeight / imageRect.height
  const sourceWidth = cropRect.width * scaleX
  const sourceHeight = cropRect.height * scaleY
  const sourceX = clampCropSource((cropRect.left - imageRect.left) * scaleX, sourceWidth, image.naturalWidth)
  const sourceY = clampCropSource((cropRect.top - imageRect.top) * scaleY, sourceHeight, image.naturalHeight)
  const canvas = document.createElement('canvas')

  canvas.width = outputWidth
  canvas.height = outputHeight

  const context = canvas.getContext('2d')
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(
    image,
    sourceX,
    sourceY,
    Math.min(sourceWidth, image.naturalWidth),
    Math.min(sourceHeight, image.naturalHeight),
    0,
    0,
    outputWidth,
    outputHeight,
  )

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.9)
  })

  if (!blob) throw new Error('Could not crop this image.')

  return new File([blob], `${filePrefix}-${crypto.randomUUID()}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  })
}

async function uploadProfileImage(file, userId, folder) {
  if (!(file instanceof File) || !userId) return null

  const path = `${userId}/${folder}/${crypto.randomUUID()}.${getFileExtension(file)}`
  const { data, error } = await supabase.storage
    .from(PROFILE_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  const { data: publicData } = supabase.storage
    .from(PROFILE_BUCKET)
    .getPublicUrl(data.path)

  return {
    path: data.path,
    url: publicData.publicUrl,
  }
}

function isMissingPinnedColumnError(error) {
  return error?.code === '42703'
    || error?.message?.toLowerCase().includes('pinned')
    || error?.details?.toLowerCase().includes('pinned')
}

function isMissingLikesTableError(error) {
  return error?.code === '42P01'
    || error?.code === 'PGRST205'
    || error?.message?.toLowerCase().includes('profile_post_likes')
}

function isMissingPostImagesColumnError(error) {
  const message = `${error?.message || ''} ${error?.details || ''}`.toLowerCase()

  return error?.code === '42703'
    || message.includes('images')
    || message.includes('image_paths')
}

function isMissingBioColumnError(error) {
  const message = `${error?.message || ''} ${error?.details || ''}`.toLowerCase()

  return error?.code === '42703' || message.includes('bio')
}

async function fetchUserProfile(userId) {
  const withBio = await supabase
    .from('user_profiles')
    .select('uname,avatar,banner,bio,created')
    .eq('id', userId)
    .maybeSingle()

  if (!withBio.error) return { data: withBio.data, error: null, supportsBio: true }

  if (!isMissingBioColumnError(withBio.error)) {
    return { data: null, error: withBio.error, supportsBio: true }
  }

  const withoutBio = await supabase
    .from('user_profiles')
    .select('uname,avatar,banner,created')
    .eq('id', userId)
    .maybeSingle()

  return { data: withoutBio.data, error: withoutBio.error, supportsBio: false }
}

function getPostImages(post) {
  if (Array.isArray(post?.images) && post.images.length > 0) {
    return post.images.filter(Boolean)
  }

  return post?.image_url ? [post.image_url] : []
}

function getPostImagePaths(post) {
  if (Array.isArray(post?.image_paths) && post.image_paths.length > 0) {
    return post.image_paths.filter(Boolean)
  }

  return post?.image_path ? [post.image_path] : []
}

function getPostSelect({ supportsPinnedPosts, supportsMultiImagePosts }) {
  if (supportsPinnedPosts) return POST_SELECT_WITH_PINNED
  if (supportsMultiImagePosts) return POST_SELECT_WITH_IMAGES
  return POST_SELECT_BASE
}

function normalizePosts(data, profiles = []) {
  const profilesById = profiles.reduce((items, item) => {
    items[item.id] = item
    return items
  }, {})

  return (data || []).map((post) => ({
    ...post,
    author: {
      id: post.user_id,
      name: profilesById[post.user_id]?.uname || 'User',
      avatar: profilesById[post.user_id]?.avatar || '',
    },
    pinned: Boolean(post.pinned),
    images: Array.isArray(post.images) && post.images.length > 0
      ? post.images
      : post.image_url
        ? [post.image_url]
        : [],
    image_paths: Array.isArray(post.image_paths) && post.image_paths.length > 0
      ? post.image_paths
      : post.image_path
        ? [post.image_path]
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

function applyPostLikes(posts, likeRows = []) {
  const likesByPost = likeRows.reduce((counts, row) => {
    counts[row.post_id] = (counts[row.post_id] || 0) + 1
    return counts
  }, {})

  return posts.map((post) => ({
    ...post,
    likes_count: likesByPost[post.id] || 0,
    liked_by_user: likeRows.some((row) => row.post_id === post.id && row.liked_by_user),
  }))
}

async function fetchProfilePosts(userId) {
  const withImages = await supabase
    .from('profile_posts')
    .select(POST_SELECT_WITH_IMAGES)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (!withImages.error) {
    return {
      data: normalizePosts(withImages.data),
      error: null,
      supportsPinned: false,
      supportsMultiImages: true,
    }
  }

  if (!isMissingPostImagesColumnError(withImages.error)) {
    return {
      data: [],
      error: withImages.error,
      supportsPinned: false,
      supportsMultiImages: true,
    }
  }

  const posts = await supabase
    .from('profile_posts')
    .select(POST_SELECT_BASE)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return {
    data: normalizePosts(posts.data),
    error: posts.error,
    supportsPinned: false,
    supportsMultiImages: false,
  }
}

async function fetchLikedPosts(profileOwnerId, currentUserId = '', supportsMultiImages = true) {
  if (!profileOwnerId) return { data: [], error: null }

  const likes = await supabase
    .from('profile_post_likes')
    .select('post_id,created_at')
    .eq('user_id', profileOwnerId)
    .order('created_at', { ascending: false })

  if (likes.error) return { data: [], error: likes.error }

  const likedPostIds = (likes.data || []).map((like) => like.post_id)
  if (likedPostIds.length === 0) return { data: [], error: null }

  const posts = await supabase
    .from('profile_posts')
    .select(supportsMultiImages ? POST_SELECT_WITH_IMAGES : POST_SELECT_BASE)
    .in('id', likedPostIds)

  if (posts.error) return { data: [], error: posts.error }

  const profiles = await fetchPostProfiles(posts.data)
  const { data: likeData, error: likeError } = await supabase
    .from('profile_post_likes')
    .select('post_id,user_id')
    .in('post_id', likedPostIds)

  if (likeError) return { data: [], error: likeError }

  const likedOrder = likedPostIds.reduce((items, postId, index) => {
    items[postId] = index
    return items
  }, {})

  return {
    data: applyPostLikes(normalizePosts(posts.data, profiles), (likeData || []).map((row) => ({
      ...row,
      liked_by_user: row.user_id === currentUserId,
    })))
      .sort((a, b) => likedOrder[a.id] - likedOrder[b.id]),
    error: null,
  }
}

function Profile() {
  const navigate = useNavigate()
  const { profileId } = useParams()
  const cropFrameRef = useRef(null)
  const cropImageRef = useRef(null)
  const cropBoxRef = useRef(null)
  const cropDragRef = useRef(null)
  const [userId, setUserId] = useState('')
  const [profileUserId, setProfileUserId] = useState('')
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [postBody, setPostBody] = useState('')
  const [postImages, setPostImages] = useState([])
  const [postIndividually, setPostIndividually] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [editProfileForm, setEditProfileForm] = useState({ uname: '', bio: '' })
  const [activeProfileTab, setActiveProfileTab] = useState('posts')
  const [isPostComposerOpen, setIsPostComposerOpen] = useState(false)
  const [selectedMediaPost, setSelectedMediaPost] = useState(null)
  const [profileMediaPreview, setProfileMediaPreview] = useState(null)
  const [selectedPostImageIndex, setSelectedPostImageIndex] = useState(0)
  const [openPostMenuId, setOpenPostMenuId] = useState(null)
  const [editingPostId, setEditingPostId] = useState(null)
  const [editingPostBody, setEditingPostBody] = useState('')
  const [supportsPinnedPosts, setSupportsPinnedPosts] = useState(true)
  const [supportsMultiImagePosts, setSupportsMultiImagePosts] = useState(true)
  const [supportsLikes, setSupportsLikes] = useState(true)
  const [supportsBio, setSupportsBio] = useState(true)
  const [likingPostId, setLikingPostId] = useState(null)
  const [mediaCrop, setMediaCrop] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [deletingPostId, setDeletingPostId] = useState(null)
  const [status, setStatus] = useState({ type: '', message: '' })

  const displayName = profile?.uname || 'User'
  const isOwnProfile = Boolean(userId && profileUserId && userId === profileUserId)
  const mediaItems = posts.flatMap((post) => getPostImages(post).map((imageUrl, imageIndex) => ({
    post,
    imageUrl,
    imageIndex,
  })))
  const postPreviewUrls = useMemo(() => (
    postImages.map((file) => URL.createObjectURL(file))
  ), [postImages])

  useEffect(() => () => {
    postPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
  }, [postPreviewUrls])

  useEffect(() => () => {
    if (mediaCrop?.url) URL.revokeObjectURL(mediaCrop.url)
  }, [mediaCrop?.url])

  useEffect(() => {
    if (!status.message) return undefined

    const timeoutId = window.setTimeout(() => {
      setStatus({ type: '', message: '' })
    }, 3000)

    return () => window.clearTimeout(timeoutId)
  }, [status.message])

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      setIsLoading(true)

      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData.session?.user

      if (!user && !profileId) {
        navigateWithTransition(navigate, '/login', 'fade')
        return
      }

      const authUserId = user?.id || ''
      const targetUserId = profileId || authUserId

      const [profileResult, postsResult] = await Promise.all([
        fetchUserProfile(targetUserId),
        fetchProfilePosts(targetUserId),
      ])
      const { data: profileData, error: profileError } = profileResult

      if (!isMounted) return

      let nextPosts = postsResult.data || []
      let likesError = null
      let likesSupported = true

      if (nextPosts.length > 0) {
        const postIds = nextPosts.map((post) => post.id)
        const { data: likeData, error: likeError } = await supabase
          .from('profile_post_likes')
          .select('post_id,user_id')
          .in('post_id', postIds)

        if (likeError && isMissingLikesTableError(likeError)) {
          likesSupported = false
        } else if (likeError) {
          likesError = likeError
        } else {
          const profiles = await fetchPostProfiles(nextPosts)
          nextPosts = normalizePosts(nextPosts, profiles)
          nextPosts = applyPostLikes(nextPosts, (likeData || []).map((row) => ({
            ...row,
            liked_by_user: row.user_id === authUserId,
          })))
        }
      }

      const likedPostsResult = targetUserId && likesSupported
        ? await fetchLikedPosts(targetUserId, authUserId, postsResult.supportsMultiImages)
        : { data: [], error: null }

      if (likedPostsResult.error && isMissingLikesTableError(likedPostsResult.error)) {
        likesSupported = false
      } else if (likedPostsResult.error) {
        likesError = likedPostsResult.error
      }

      if (profileError || postsResult.error || likesError) {
        setStatus({
          type: 'error',
          message: profileError?.message || postsResult.error?.message || likesError?.message || 'Could not load your profile.',
        })
      }

      setUserId(authUserId)
      setProfileUserId(targetUserId)
      setProfile({
        email: profileData?.email || (targetUserId === authUserId ? user?.email : '') || '',
        uname: profileData?.uname
          || (targetUserId === authUserId ? user?.user_metadata?.uname || user?.email?.split('@')[0] : '')
          || 'User',
        avatar: profileData?.avatar || (targetUserId === authUserId ? user?.user_metadata?.avatar_url : '') || '',
        banner: profileData?.banner || '',
        bio: profileData?.bio || '',
        created: profileData?.created,
      })
      setEditProfileForm({
        uname: profileData?.uname || user?.user_metadata?.uname || user?.email?.split('@')[0] || 'User',
        bio: profileData?.bio || '',
      })
      setPosts(nextPosts)
      setLikedPosts(likesSupported ? likedPostsResult.data || [] : [])
      setSupportsPinnedPosts(postsResult.supportsPinned)
      setSupportsMultiImagePosts(postsResult.supportsMultiImages)
      setSupportsLikes(likesSupported)
      setSupportsBio(profileResult.supportsBio)
      setIsLoading(false)
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [navigate, profileId])

  const handleMediaCropFileChange = (event, type) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file || !userId) return

    setMediaCrop((current) => {
      if (current?.url) URL.revokeObjectURL(current.url)

      const isAvatar = type === 'avatar'

      return {
        type,
        file,
        url: URL.createObjectURL(file),
        offset: { x: 0, y: 0 },
        zoom: 1,
        aspect: isAvatar ? AVATAR_CROP_ASPECT : BANNER_CROP_ASPECT,
        outputWidth: isAvatar ? AVATAR_OUTPUT_SIZE : BANNER_OUTPUT_WIDTH,
        outputHeight: isAvatar ? AVATAR_OUTPUT_SIZE : BANNER_OUTPUT_HEIGHT,
        folder: isAvatar ? 'avatar' : 'banner',
        field: isAvatar ? 'avatar' : 'banner',
        title: 'Edit media',
        successMessage: isAvatar ? 'Profile picture updated.' : 'Banner updated.',
        errorMessage: isAvatar ? 'Could not update your profile picture.' : 'Could not update your banner.',
        zoomLabel: isAvatar ? 'Profile picture zoom' : 'Banner zoom',
      }
    })
    setStatus({ type: '', message: '' })
  }

  const closeMediaCrop = () => {
    setMediaCrop((current) => {
      if (current?.url) URL.revokeObjectURL(current.url)
      return null
    })
    cropDragRef.current = null
  }

  const beginCropDrag = (event) => {
    if (!mediaCrop) return

    event.currentTarget.setPointerCapture(event.pointerId)
    cropDragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      offset: mediaCrop.offset,
    }
  }

  const moveCropDrag = (event) => {
    if (!cropDragRef.current) return

    const drag = cropDragRef.current
    setMediaCrop((current) => {
      if (!current) return current
      const nextOffset = {
        x: drag.offset.x + event.clientX - drag.startX,
        y: drag.offset.y + event.clientY - drag.startY,
      }

      return {
        ...current,
        offset: nextOffset,
      }
    })
  }

  const endCropDrag = () => {
    cropDragRef.current = null
  }

  const updateMediaZoom = (event) => {
    const zoom = Number(event.target.value)

    setMediaCrop((current) => {
      if (!current) return current

      return {
        ...current,
        zoom,
      }
    })
  }

  const applyMediaCrop = async () => {
    if (!mediaCrop || !cropImageRef.current || !cropBoxRef.current || !userId) return

    setIsSavingProfile(true)
    setStatus({ type: '', message: '' })

    try {
      const croppedFile = await cropMediaToFile({
        imageUrl: mediaCrop.url,
        imageElement: cropImageRef.current,
        cropElement: cropBoxRef.current,
        outputWidth: mediaCrop.outputWidth,
        outputHeight: mediaCrop.outputHeight,
        filePrefix: mediaCrop.folder,
      })
      const uploaded = await uploadProfileImage(croppedFile, userId, mediaCrop.folder)
      const { error } = await supabase
        .from('users')
        .update({ [mediaCrop.field]: uploaded.url })
        .eq('id', userId)

      if (error) throw error

      setProfile((current) => ({
        ...current,
        [mediaCrop.field]: uploaded.url,
      }))
      const successMessage = mediaCrop.successMessage
      closeMediaCrop()
      setStatus({ type: 'success', message: successMessage })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || mediaCrop.errorMessage })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleCreatePost = async (event) => {
    event.preventDefault()

    if (!postBody.trim() && postImages.length === 0) {
      setStatus({ type: 'error', message: 'Write something or choose an image before posting.' })
      return
    }

    setIsCreatingPost(true)
    setStatus({ type: '', message: '' })

    try {
      if (postImages.length > 1 && !postIndividually && !supportsMultiImagePosts) {
        throw new Error('Multiple images in one post need the profile post images migration in Supabase first.')
      }

      const uploadedImages = await Promise.all(postImages.map((file) => uploadProfileImage(file, userId, 'posts')))
      const rowImages = postIndividually ? uploadedImages : [uploadedImages[0] || null]

      const rows = (postImages.length > 0 ? rowImages : [null]).map((uploaded) => ({
        user_id: userId,
        body: postBody.trim() || null,
        image_url: uploaded?.url || null,
        image_path: uploaded?.path || null,
        ...(postImages.length > 1 && !postIndividually
          ? {
            images: uploadedImages.map((image) => image.url),
            image_paths: uploadedImages.map((image) => image.path),
          }
          : {}),
      }))

      const query = supabase
        .from('profile_posts')
        .insert(rows.length === 1
          ? {
            user_id: userId,
            body: postBody.trim() || null,
            image_url: uploadedImages[0]?.url || null,
            image_path: uploadedImages[0]?.path || null,
            ...(postImages.length > 1 && !postIndividually
              ? {
                images: uploadedImages.map((image) => image.url),
                image_paths: uploadedImages.map((image) => image.path),
              }
              : {}),
          }
          : rows)
        .select(getPostSelect({ supportsPinnedPosts, supportsMultiImagePosts }))

      const { data, error } = rows.length === 1
        ? await query.single()
        : await query

      if (error) throw error

      const createdPosts = normalizePosts(Array.isArray(data) ? data : [data])
        .map((post) => ({ ...post, likes_count: 0, liked_by_user: false }))

      setPosts((current) => [...createdPosts, ...current])
      setPostBody('')
      setPostImages([])
      setPostIndividually(false)
      setIsPostComposerOpen(false)
      setStatus({
        type: 'success',
        message: createdPosts.length === 1 ? 'Post published.' : `${createdPosts.length} posts published.`,
      })
    } catch (error) {
      if (isMissingPostImagesColumnError(error)) {
        setSupportsMultiImagePosts(false)
        setStatus({ type: 'error', message: 'Multiple images in one post need the profile post images migration in Supabase first.' })
        return
      }

      setStatus({ type: 'error', message: error.message || 'Could not create your post.' })
    } finally {
      setIsCreatingPost(false)
    }
  }

  const handleDeletePost = async (post) => {
    setDeletingPostId(post.id)
    setStatus({ type: '', message: '' })
    setOpenPostMenuId(null)

    try {
      const { error } = await supabase
        .from('profile_posts')
        .delete()
        .eq('id', post.id)
        .eq('user_id', userId)

      if (error) throw error

      const pathsToRemove = getPostImagePaths(post)

      if (pathsToRemove.length > 0) {
        await supabase.storage.from(PROFILE_BUCKET).remove(pathsToRemove)
      }

      setPosts((current) => current.filter((item) => item.id !== post.id))
      setSelectedMediaPost((current) => (current?.id === post.id ? null : current))
      setStatus({ type: 'success', message: 'Post deleted.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not delete this post.' })
    } finally {
      setDeletingPostId(null)
    }
  }

  const updatePostLikeState = (postId, updater) => {
    setPosts((current) => current.map((post) => (
      post.id === postId ? updater(post) : post
    )))
    setLikedPosts((current) => {
      const nextLikedPosts = current.map((post) => (
        post.id === postId ? updater(post) : post
      ))

      return isOwnProfile
        ? nextLikedPosts.filter((post) => post.liked_by_user)
        : nextLikedPosts
    })
    setSelectedMediaPost((current) => (
      current?.id === postId ? updater(current) : current
    ))
  }

  const handleToggleLike = async (post) => {
    if (!userId) {
      navigateWithTransition(navigate, '/login', 'fade')
      return
    }

    if (!supportsLikes) {
      setStatus({ type: 'error', message: 'Likes need the profile_post_likes table migration in Supabase first.' })
      return
    }

    setLikingPostId(post.id)
    setStatus({ type: '', message: '' })

    try {
      if (post.liked_by_user) {
        const { error } = await supabase
          .from('profile_post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', userId)

        if (error) throw error

        updatePostLikeState(post.id, (item) => ({
          ...item,
          liked_by_user: false,
          likes_count: Math.max((item.likes_count || 0) - 1, 0),
        }))
      } else {
        const { error } = await supabase
          .from('profile_post_likes')
          .insert({ post_id: post.id, user_id: userId })

        if (error) throw error

        updatePostLikeState(post.id, (item) => ({
          ...item,
          liked_by_user: true,
          likes_count: (item.likes_count || 0) + 1,
        }))
      }
    } catch (error) {
      if (isMissingLikesTableError(error)) {
        setSupportsLikes(false)
        setStatus({ type: 'error', message: 'Likes need the profile_post_likes table migration in Supabase first.' })
        return
      }

      setStatus({ type: 'error', message: error.message || 'Could not update this like.' })
    } finally {
      setLikingPostId(null)
    }
  }

  const startEditingPost = (post) => {
    setEditingPostId(post.id)
    setEditingPostBody(post.body || '')
    setOpenPostMenuId(null)
  }

  const cancelEditingPost = () => {
    setEditingPostId(null)
    setEditingPostBody('')
  }

  const closePostComposer = () => {
    setIsPostComposerOpen(false)
    setPostBody('')
    setPostImages([])
    setPostIndividually(false)
  }

  const openEditProfile = () => {
    if (!isOwnProfile) return

    setEditProfileForm({
      uname: profile?.uname || '',
      bio: profile?.bio || '',
    })
    setIsEditProfileOpen(true)
  }

  const closeEditProfile = () => {
    setIsEditProfileOpen(false)
  }

  const navigateToProfile = (targetUserId) => {
    if (!targetUserId) return

    setSelectedMediaPost(null)
    setOpenPostMenuId(null)
    navigateWithTransition(
      navigate,
      targetUserId === userId ? '/profile' : `/profile/${targetUserId}`,
      'fade',
    )
  }

  const handleSaveProfile = async (event) => {
    event.preventDefault()

    const nextName = editProfileForm.uname.trim()
    const nextBio = editProfileForm.bio.trim()

    if (!nextName) {
      setStatus({ type: 'error', message: 'Name cannot be empty.' })
      return
    }

    if (!supportsBio && nextBio) {
      setStatus({ type: 'error', message: 'Saving bio needs the users.bio migration in Supabase first.' })
      return
    }

    setIsSavingProfile(true)
    setStatus({ type: '', message: '' })

    try {
      const payload = supportsBio
        ? { uname: nextName, bio: nextBio || null }
        : { uname: nextName }

      const { error } = await supabase
        .from('users')
        .update(payload)
        .eq('id', userId)

      if (error) throw error

      await supabase.auth.updateUser({
        data: { uname: nextName },
      })

      setProfile((current) => ({
        ...current,
        uname: nextName,
        bio: supportsBio ? nextBio : current.bio,
      }))
      setIsEditProfileOpen(false)
      setStatus({ type: 'success', message: 'Profile updated.' })
    } catch (error) {
      if (isMissingBioColumnError(error)) {
        setSupportsBio(false)
        setStatus({ type: 'error', message: 'Saving bio needs the users.bio migration in Supabase first.' })
        return
      }

      setStatus({ type: 'error', message: error.message || 'Could not update your profile.' })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const openPostModal = (post, imageIndex = 0) => {
    setSelectedMediaPost(post)
    setSelectedPostImageIndex(imageIndex)
  }

  const openProfileMediaPreview = (type) => {
    setProfileMediaPreview({
      type,
      url: type === 'avatar' ? profile?.avatar || avatarFallback : profile?.banner || defaultBanner,
      label: type === 'avatar' ? `${displayName}'s profile picture` : `${displayName}'s banner`,
    })
  }

  const moveSelectedPostImage = (direction) => {
    if (!selectedMediaPost) return

    const imageCount = getPostImages(selectedMediaPost).length
    setSelectedPostImageIndex((current) => (current + direction + imageCount) % imageCount)
  }

  const handleUpdatePost = async (post) => {
    const nextBody = editingPostBody.trim()

    if (!nextBody && !post.image_url) {
      setStatus({ type: 'error', message: 'Write something or keep an image before saving.' })
      return
    }

    setStatus({ type: '', message: '' })

    try {
      const { data, error } = await supabase
        .from('profile_posts')
        .update({ body: nextBody || null, updated_at: new Date().toISOString() })
        .eq('id', post.id)
        .eq('user_id', userId)
        .select(getPostSelect({ supportsPinnedPosts, supportsMultiImagePosts }))
        .single()

      if (error) throw error

      const nextPost = normalizePosts([data])[0]
      setPosts((current) => current.map((item) => (item.id === post.id ? nextPost : item)))
      setSelectedMediaPost((current) => (current?.id === post.id ? nextPost : current))
      cancelEditingPost()
      setStatus({ type: 'success', message: 'Post updated.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not update this post.' })
    }
  }

  const handlePinPost = async (post) => {
    setStatus({ type: '', message: '' })
    setOpenPostMenuId(null)

    try {
      const nextPinned = !post.pinned

      if (nextPinned) {
        const { error: clearError } = await supabase
          .from('profile_posts')
          .update({ pinned: false })
          .eq('user_id', userId)

        if (clearError) throw clearError
      }

      const { data, error } = await supabase
        .from('profile_posts')
        .update({ pinned: nextPinned, updated_at: new Date().toISOString() })
        .eq('id', post.id)
        .eq('user_id', userId)
        .select(POST_SELECT_WITH_PINNED)
        .single()

      if (error) throw error

      setSupportsPinnedPosts(true)
      setPosts((current) => {
        const nextPosts = current.map((item) => (
          item.id === post.id ? data : { ...item, pinned: nextPinned ? false : item.pinned }
        ))

        return nextPosts.sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
          return new Date(b.created_at) - new Date(a.created_at)
        })
      })
      setSelectedMediaPost((current) => (current?.id === post.id ? data : current))
      setStatus({ type: 'success', message: nextPinned ? 'Post pinned to profile.' : 'Post unpinned.' })
    } catch (error) {
      if (isMissingPinnedColumnError(error)) {
        setSupportsPinnedPosts(false)
        setStatus({ type: 'error', message: 'Pinning needs the pinned column migration in Supabase first.' })
        return
      }

      setStatus({ type: 'error', message: error.message || 'Could not pin this post.' })
    }
  }

  const renderPostAuthor = (post, titleId) => {
    const authorId = post.author?.id || post.user_id || profileUserId
    const authorName = post.author?.name || displayName
    const authorAvatar = post.author?.avatar || profile?.avatar || avatarFallback

    return (
    <button
      className="post-author"
      type="button"
      onClick={() => navigateToProfile(authorId)}
      aria-label={`Open ${authorName}'s profile`}
    >
      <img src={authorAvatar} alt="" />
      <div>
        <strong id={titleId}>{authorName}</strong>
        <span>{formatPostDate(post.created_at)}</span>
      </div>
    </button>
    )
  }

  const renderPostMenu = (post) => {
    if (!isOwnProfile || post.user_id !== userId) return null

    return (
    <div className="post-menu-wrap">
      <button
        className="post-more-button"
        type="button"
        disabled={deletingPostId === post.id}
        onClick={() => setOpenPostMenuId((current) => (current === post.id ? null : post.id))}
        aria-label="More post actions"
        aria-expanded={openPostMenuId === post.id}
      >
        {deletingPostId === post.id ? <Loader2 className="spin" /> : <MoreHorizontal />}
      </button>

      {openPostMenuId === post.id && (
        <div className="post-action-menu" role="menu">
          <button type="button" role="menuitem" onClick={() => handleDeletePost(post)}>
            <Trash2 />
            <span>Delete post</span>
          </button>
          <button type="button" role="menuitem" onClick={() => startEditingPost(post)}>
            <Edit3 />
            <span>Edit post</span>
          </button>
          <button type="button" role="menuitem" onClick={() => handlePinPost(post)}>
            <Pin />
            <span>{post.pinned ? 'Unpin from profile' : 'Pin to profile'}</span>
          </button>
        </div>
      )}
    </div>
    )
  }

  const renderLikeButton = (post) => (
    <button
      className={`post-like-button ${post.liked_by_user ? 'liked' : ''}`}
      type="button"
      disabled={likingPostId === post.id}
      onClick={() => handleToggleLike(post)}
      aria-label={post.liked_by_user ? 'Unlike post' : 'Like post'}
    >
      {likingPostId === post.id ? <Loader2 className="spin" /> : <Heart />}
      <span>{post.likes_count || 0}</span>
    </button>
  )

  const renderPostImages = (post) => {
    const images = getPostImages(post)

    if (images.length === 0) return null

    if (images.length === 1) {
      return (
        <button className="post-image-button" type="button" onClick={() => openPostModal(post, 0)}>
          <img className="post-image" src={images[0]} alt="" />
        </button>
      )
    }

    const visibleImages = images.slice(0, 4)
    const remainingImages = images.length - 4

    return (
      <div className={`post-image-grid image-count-${Math.min(images.length, 4)}`}>
        {visibleImages.map((imageUrl, index) => (
          <button
            className="post-grid-image"
            type="button"
            key={`${post.id}-${imageUrl}-${index}`}
            onClick={() => openPostModal(post, index)}
          >
            <img src={imageUrl} alt="" />
            {index === 3 && remainingImages > 0 && (
              <span className="post-image-more">+{remainingImages}</span>
            )}
          </button>
        ))}
      </div>
    )
  }

  const selectedPostImages = getPostImages(selectedMediaPost)
  const selectedPostImageUrl = selectedPostImages[selectedPostImageIndex] || selectedPostImages[0] || selectedMediaPost?.image_url

  return (
    <main className="profile-page">
      <section
        className="profile-hero"
        style={{ backgroundImage: `url("${profile?.banner || defaultBanner}")` }}
      >
        <button
          className="profile-banner-preview"
          type="button"
          onClick={() => openProfileMediaPreview('banner')}
          aria-label="Open banner"
        />

        {isOwnProfile && (
          <button
            className="profile-banner-action"
            type="button"
            onClick={openEditProfile}
            aria-label="Edit profile"
          >
            <Pencil />
            <span>Edit profile</span>
          </button>
        )}

        <div className="profile-shell profile-summary">
          <div className="profile-identity">
            <button
              className="profile-avatar"
              type="button"
              onClick={() => openProfileMediaPreview('avatar')}
              aria-label="Open profile picture"
            >
              <img src={profile?.avatar || avatarFallback} alt="" />
            </button>
            <div>
              <h1 className="profile-name">{isLoading ? 'Loading...' : displayName}</h1>
              <p className="profile-bio">{profile?.bio || 'Bio'}</p>
            </div>
          </div>

          <div className="profile-stats">
            <span className="profile-stat"><Clock /> {formatJoinedDate(profile?.created)}</span>
          </div>
        </div>
      </section>

      <div className="profile-shell">
        <nav className="profile-tabs" aria-label="Profile sections">
          <div className="profile-tab-list">
            <button
              className={activeProfileTab === 'posts' ? 'active' : ''}
              type="button"
              onClick={() => setActiveProfileTab('posts')}
            >
              Posts
            </button>
            <button
              className={activeProfileTab === 'media' ? 'active' : ''}
              type="button"
              onClick={() => setActiveProfileTab('media')}
            >
              Media
            </button>
            <button
              className={activeProfileTab === 'likes' ? 'active' : ''}
              type="button"
              onClick={() => setActiveProfileTab('likes')}
            >
              Likes
            </button>
          </div>
          {isOwnProfile && (
            <button
              className="add-post-button"
              type="button"
              onClick={() => setIsPostComposerOpen(true)}
            >
              <ImagePlus />
              <span>Add post</span>
            </button>
          )}
        </nav>

        <section className="profile-content">
          {activeProfileTab === 'posts' ? (
            <>
              <div className="posts-header">
                <h2 className="profile-section-title">Your Posts</h2>
                <span>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
              </div>

              <div className="profile-posts">
                {posts.length === 0 && !isLoading ? (
                  <p className="empty-posts">No posts yet.</p>
                ) : (
                  posts.map((post) => (
                    <article className="profile-post" key={post.id}>
                      <div className="post-meta">
                        {renderPostAuthor(post)}

                        {renderPostMenu(post)}
                      </div>

                      {editingPostId === post.id ? (
                        <div className="post-edit-form">
                          <textarea
                            value={editingPostBody}
                            onChange={(event) => setEditingPostBody(event.target.value)}
                            rows={3}
                          />
                          <div className="post-edit-actions">
                            <button type="button" onClick={cancelEditingPost}>Cancel</button>
                            <button type="button" onClick={() => handleUpdatePost(post)}>Save</button>
                          </div>
                        </div>
                      ) : (
                        post.body && <p className="post-body">{post.body}</p>
                      )}
                      {renderPostImages(post)}
                      <div className="post-actions-row">
                        {renderLikeButton(post)}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </>
          ) : activeProfileTab === 'media' ? (
            <>
              <div className="posts-header">
                <h2 className="profile-section-title">Media</h2>
                <span>{mediaItems.length} {mediaItems.length === 1 ? 'photo' : 'photos'}</span>
              </div>

              {mediaItems.length === 0 && !isLoading ? (
                <p className="empty-posts">No media yet.</p>
              ) : (
                <div className="profile-media-grid">
                  {mediaItems.map(({ post, imageUrl, imageIndex }) => (
                    <button
                      className="media-tile"
                      key={`${post.id}-${imageIndex}`}
                      type="button"
                      onClick={() => openPostModal(post, imageIndex)}
                      aria-label="Open post"
                    >
                      <img src={imageUrl} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="posts-header">
                <h2 className="profile-section-title">Liked Posts</h2>
                <span>{likedPosts.length} {likedPosts.length === 1 ? 'post' : 'posts'}</span>
              </div>

              {likedPosts.length === 0 && !isLoading ? (
                <p className="empty-posts">No liked posts yet.</p>
              ) : (
                <div className="profile-posts">
                  {likedPosts.map((post) => (
                    <article className="profile-post" key={post.id}>
                      <div className="post-meta">
                        {renderPostAuthor(post)}

                        {renderPostMenu(post)}
                      </div>

                      {post.body && <p className="post-body">{post.body}</p>}
                      {renderPostImages(post)}
                      <div className="post-actions-row">
                        {renderLikeButton(post)}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {status.message && (
        <p className={`profile-status ${status.type}`} role="status">
          {status.message}
        </p>
      )}

      {isPostComposerOpen && (
        <div className="post-composer-modal" role="dialog" aria-modal="true" aria-labelledby="post-composer-title">
          <button
            className="post-modal-backdrop"
            type="button"
            onClick={closePostComposer}
            aria-label="Close add post"
          />
          <form className="post-composer modal-composer" onSubmit={handleCreatePost}>
            <header className="composer-modal-header">
              <h2 id="post-composer-title">Add post</h2>
              <button type="button" onClick={closePostComposer}>Cancel</button>
            </header>

            <div className="composer-avatar">
              <img src={profile?.avatar || avatarFallback} alt="" />
            </div>

            <div className="composer-body">
              <textarea
                value={postBody}
                onChange={(event) => setPostBody(event.target.value)}
                placeholder="Share a build, pull result, screenshot, or thought..."
                rows={4}
              />

              {postPreviewUrls.length > 0 && (
                <div className="composer-preview-grid">
                  {postPreviewUrls.map((url, index) => (
                    <div className="composer-preview" key={url}>
                      <img src={url} alt="" />
                      <button
                        type="button"
                        onClick={() => {
                          setPostImages((current) => current.filter((_, imageIndex) => imageIndex !== index))
                          if (postImages.length <= 2) setPostIndividually(false)
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {postImages.length > 1 && (
                <label className="post-individually">
                  <input
                    type="checkbox"
                    checked={postIndividually}
                    onChange={(event) => setPostIndividually(event.target.checked)}
                  />
                  <span>Post individually</span>
                </label>
              )}

              <div className="composer-actions">
                <label className="image-picker">
                  <ImagePlus />
                  <span>{postImages.length > 0 ? `${postImages.length} selected` : 'Add image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => {
                      setPostImages(Array.from(event.target.files || []))
                      setPostIndividually(false)
                    }}
                  />
                </label>

                <button className="post-submit" type="submit" disabled={isCreatingPost || isLoading}>
                  {isCreatingPost ? <Loader2 className="spin" /> : <Send />}
                  <span>{isCreatingPost ? 'Posting...' : 'Post'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {isEditProfileOpen && (
        <div className="edit-profile-modal" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
          <button
            className="post-modal-backdrop"
            type="button"
            onClick={closeEditProfile}
            aria-label="Close edit profile"
          />
          <form className="edit-profile-panel" onSubmit={handleSaveProfile}>
            <header className="composer-modal-header">
              <h2 id="edit-profile-title">Edit profile</h2>
              <button type="button" onClick={closeEditProfile}>Cancel</button>
            </header>

            <div className="edit-profile-media">
              <section
                className="edit-profile-banner"
                style={{ backgroundImage: `url("${profile?.banner || defaultBanner}")` }}
              >
                <label className="edit-media-button">
                  <Pencil />
                  <span>Edit banner</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isSavingProfile}
                    onChange={(event) => handleMediaCropFileChange(event, 'banner')}
                  />
                </label>
              </section>

              <label className="edit-profile-avatar">
                <img src={profile?.avatar || avatarFallback} alt="" />
                <span><Camera /></span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isSavingProfile}
                  onChange={(event) => handleMediaCropFileChange(event, 'avatar')}
                />
              </label>
            </div>

            <label className="edit-profile-field">
              <span className="edit-profile-label-row">
                <span>Name</span>
                <span className="edit-profile-note">ⓘ This will also update your login credentials</span>
              </span>
              <input
                type="text"
                value={editProfileForm.uname}
                onChange={(event) => setEditProfileForm((current) => ({
                  ...current,
                  uname: event.target.value,
                }))}
                maxLength={60}
              />
            </label>

            <label className="edit-profile-field">
              <span>Bio</span>
              <textarea
                value={editProfileForm.bio}
                onChange={(event) => setEditProfileForm((current) => ({
                  ...current,
                  bio: event.target.value,
                }))}
                rows={4}
                maxLength={180}
                placeholder={supportsBio ? 'Add a short bio.' : 'Run the bio migration to save this field.'}
              />
            </label>

            <button className="post-submit edit-profile-save" type="submit" disabled={isSavingProfile}>
              {isSavingProfile ? <Loader2 className="spin" /> : <Pencil />}
              <span>{isSavingProfile ? 'Saving...' : 'Save profile'}</span>
            </button>
          </form>
        </div>
      )}

      {selectedMediaPost && (
        <div className="post-modal" role="dialog" aria-modal="true" aria-labelledby="post-modal-title">
          <button
            className="post-modal-backdrop"
            type="button"
            onClick={() => setSelectedMediaPost(null)}
            aria-label="Close post"
          />
          <article className="post-modal-panel">
            <div className="post-modal-media">
              {selectedPostImages.length > 1 && (
                <button
                  className="post-modal-nav previous"
                  type="button"
                  onClick={() => moveSelectedPostImage(-1)}
                  aria-label="Previous image"
                >
                  <ChevronLeft />
                </button>
              )}
              <img src={selectedPostImageUrl} alt="" />
              {selectedPostImages.length > 1 && (
                <>
                  <button
                    className="post-modal-nav next"
                    type="button"
                    onClick={() => moveSelectedPostImage(1)}
                    aria-label="Next image"
                  >
                    <ChevronRight />
                  </button>
                  <span className="post-modal-count">
                    {selectedPostImageIndex + 1} / {selectedPostImages.length}
                  </span>
                </>
              )}
            </div>

            <div className="post-modal-details">
              <div className="post-meta">
                {renderPostAuthor(selectedMediaPost, 'post-modal-title')}

                {renderPostMenu(selectedMediaPost)}
              </div>

              {editingPostId === selectedMediaPost.id ? (
                <div className="post-edit-form">
                  <textarea
                    value={editingPostBody}
                    onChange={(event) => setEditingPostBody(event.target.value)}
                    rows={4}
                  />
                  <div className="post-edit-actions">
                    <button type="button" onClick={cancelEditingPost}>Cancel</button>
                    <button type="button" onClick={() => handleUpdatePost(selectedMediaPost)}>Save</button>
                  </div>
                </div>
              ) : selectedMediaPost.body ? (
                <p className="post-body">{selectedMediaPost.body}</p>
              ) : (
                <p className="post-modal-empty">No caption.</p>
              )}

              <div className="post-actions-row">
                {renderLikeButton(selectedMediaPost)}
              </div>
            </div>
          </article>
        </div>
      )}

      {profileMediaPreview && (
        <div
          className={`profile-media-preview ${profileMediaPreview.type === 'avatar' ? 'avatar-preview' : 'banner-preview'}`}
          role="dialog"
          aria-modal="true"
          aria-label={profileMediaPreview.label}
        >
          <button
            className="profile-media-preview-backdrop"
            type="button"
            onClick={() => setProfileMediaPreview(null)}
            aria-label="Close media preview"
          />
          <button
            className="profile-media-preview-close"
            type="button"
            onClick={() => setProfileMediaPreview(null)}
            aria-label="Close media preview"
          >
            <X />
          </button>
          <img src={profileMediaPreview.url} alt="" />
        </div>
      )}

      {mediaCrop && (
        <div className="banner-crop-modal" role="dialog" aria-modal="true" aria-labelledby="banner-crop-title">
          <div className="banner-crop-panel">
            <header className="banner-crop-header">
              <button type="button" className="banner-crop-back" onClick={closeMediaCrop} aria-label="Cancel media crop">
                <ArrowLeft />
              </button>
              <h2 id="banner-crop-title">{mediaCrop.title}</h2>
              <button
                type="button"
                className="banner-crop-apply"
                disabled={isSavingProfile}
                onClick={applyMediaCrop}
              >
                {isSavingProfile ? 'Applying...' : 'Apply'}
              </button>
            </header>

            <div className="banner-crop-workspace">
              <div
                className="banner-crop-frame"
                ref={cropFrameRef}
                onPointerDown={beginCropDrag}
                onPointerMove={moveCropDrag}
                onPointerUp={endCropDrag}
                onPointerCancel={endCropDrag}
              >
                <img
                  ref={cropImageRef}
                  src={mediaCrop.url}
                  alt=""
                  draggable="false"
                  style={{
                    transform: `translate(calc(-50% + ${mediaCrop.offset.x}px), calc(-50% + ${mediaCrop.offset.y}px)) scale(${mediaCrop.zoom})`,
                  }}
                />
                <div
                  className={`banner-crop-selection ${mediaCrop.type === 'avatar' ? 'avatar-crop-selection' : ''}`}
                  ref={cropBoxRef}
                  aria-hidden="true"
                  style={{ aspectRatio: mediaCrop.aspect }}
                />
              </div>
            </div>

            <div className="banner-crop-controls">
              <ZoomOut />
              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={mediaCrop.zoom}
                onChange={updateMediaZoom}
                aria-label={mediaCrop.zoomLabel}
              />
              <ZoomIn />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Profile