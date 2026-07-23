import { ChevronLeft, ChevronRight, Heart, X } from 'lucide-react'
import avatarFallback from '../../../assets/svg/star.png'

function FeedPostModal({
  compactNumber,
  formatRelativeTime,
  getPostImages,
  imageIndex,
  likingPostId,
  navigateToProfile,
  onClose,
  onMoveImage,
  onToggleLike,
  post,
}) {
  const images = getPostImages(post)
  const imageUrl = images[imageIndex] || images[0] || post.image_url

  return (
    <div className="feed-post-modal" role="dialog" aria-modal="true" aria-labelledby="feed-post-modal-title">
      <button className="feed-post-modal-backdrop" type="button" onClick={onClose} aria-label="Close post" />
      <article className="feed-post-modal-panel">
        <div className="feed-post-modal-media">
          {images.length > 1 && (
            <button className="feed-post-modal-nav previous" type="button" onClick={() => onMoveImage(-1)} aria-label="Previous image">
              <ChevronLeft />
            </button>
          )}
          <img src={imageUrl} alt="" />
          {images.length > 1 && (
            <>
              <button className="feed-post-modal-nav next" type="button" onClick={() => onMoveImage(1)} aria-label="Next image">
                <ChevronRight />
              </button>
              <span className="feed-post-modal-count">{imageIndex + 1} / {images.length}</span>
            </>
          )}
        </div>

        <div className="feed-post-modal-details">
          <div className="feed-post-header">
            <button
              className="feed-author"
              type="button"
              onClick={() => navigateToProfile(post.author.id)}
              aria-label={`Open ${post.author.name}'s profile`}
            >
              <img src={post.author.avatar || avatarFallback} alt="" />
              <div>
                <strong id="feed-post-modal-title">{post.author.name}</strong>
                <span>{formatRelativeTime(post.created_at)} ago</span>
              </div>
            </button>
            <button className="feed-post-modal-close" type="button" onClick={onClose} aria-label="Close post">
              <X />
            </button>
          </div>

          {post.body ? <p className="feed-body">{post.body}</p> : <p className="feed-modal-empty">No caption.</p>}

          <div className="feed-actions">
            <button
              className={post.liked_by_user ? 'liked' : ''}
              type="button"
              disabled={likingPostId === post.id}
              onClick={() => onToggleLike(post)}
              aria-label={post.liked_by_user ? 'Unlike post' : 'Like post'}
            >
              <Heart />
              <span>{compactNumber(post.likes_count || 0)}</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}

export default FeedPostModal