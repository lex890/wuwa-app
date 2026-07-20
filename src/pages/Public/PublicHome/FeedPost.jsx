import { Heart, MoreHorizontal } from 'lucide-react'
import avatarFallback from '../../../assets/svg/star.png'

function FeedPost({
  post,
  compactNumber,
  formatRelativeTime,
  getPostImages,
  likingPostId,
  navigateToProfile,
  onOpenPost,
  onToggleLike,
}) {
  const images = getPostImages(post)

  const renderPostImages = () => {
    if (images.length === 0) return null

    if (images.length === 1) {
      return (
        <button className="feed-post-image-button" type="button" onClick={() => onOpenPost(post, 0)}>
          <img className="feed-post-image" src={images[0]} alt="" />
        </button>
      )
    }

    const visibleImages = images.slice(0, 4)
    const remainingImages = images.length - 4

    return (
      <div className={`feed-image-grid image-count-${Math.min(images.length, 4)}`}>
        {visibleImages.map((imageUrl, index) => (
          <button
            className="feed-grid-image"
            type="button"
            key={`${post.id}-${imageUrl}-${index}`}
            onClick={() => onOpenPost(post, index)}
          >
            <img src={imageUrl} alt="" />
            {index === 3 && remainingImages > 0 && (
              <span className="feed-image-more">+{remainingImages}</span>
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    <article className="feed-post">
      <div className="feed-post-header">
        <button
          className="feed-author"
          type="button"
          onClick={() => navigateToProfile(post.author.id)}
          aria-label={`Open ${post.author.name}'s profile`}
        >
          <img src={post.author.avatar || avatarFallback} alt="" />
          <div>
            <strong>{post.author.name}</strong>
            <span>{formatRelativeTime(post.created_at)} ago</span>
          </div>
        </button>

        <button className="feed-more" type="button" aria-label="More post actions">
          <MoreHorizontal />
        </button>
      </div>

      {post.body && <p className="feed-body">{post.body}</p>}
      {renderPostImages()}

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
    </article>
  )
}

export default FeedPost
