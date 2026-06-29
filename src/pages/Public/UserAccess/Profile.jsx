import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock,
  Eye,
  Folder,
  FolderPlus,
  Heart,
  Image,
  MessageCircle,
  Search,
  Star,
  Trash2,
  VideoOff,
} from 'lucide-react'
import './Profile.scss'
import { supabase } from '../../../api/supabase.js'
import { navigateWithTransition } from '../../../utils/viewTransition.js'
import galleryImage from '../../../assets/webp/T_BgUiCommonNew05_UI.webp'
import galleryImageAlt from '../../../assets/webp/T_BgUiCommonNew01_UI.webp'
import galleryImageThird from '../../../assets/webp/T_Loadingbg.webp'
import avatarFallback from '../../../assets/svg/star.png'

function formatJoinedDate(createdAt) {
  if (!createdAt) return 'Joined recently'

  return `Joined ${new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(createdAt))}`
}

function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData.session?.user

      if (!user) {
        navigateWithTransition(navigate, '/login', 'fade')
        return
      }

      const { data } = await supabase
        .from('users')
        .select('email,uname,avatar,created')
        .eq('id', user.id)
        .maybeSingle()

      if (!isMounted) return

      setProfile({
        email: user.email,
        uname: data?.uname || user.user_metadata?.uname || user.email?.split('@')[0] || 'User',
        avatar: data?.avatar || user.user_metadata?.avatar_url || '',
        created: data?.created,
      })
      setIsLoading(false)
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [navigate])

  const displayName = profile?.uname || 'User'
  const tiles = [galleryImage, galleryImageAlt, galleryImageThird, avatarFallback]

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-shell profile-summary">
          <div className="profile-identity">
            <div className="profile-avatar">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="" />
              ) : (
                <img src={avatarFallback} alt="" />
              )}
            </div>
            <h1 className="profile-name">{isLoading ? 'Loading...' : displayName}</h1>
          </div>

          <div className="profile-stats">
            <span className="profile-stat"><Clock /> {formatJoinedDate(profile?.created)}</span>
            <span className="profile-stat"><Star /> 570 XP</span>
            <span className="profile-stat"><Image /> 37 Posts</span>
            <span className="profile-stat"><MessageCircle /> 0 Comments</span>
            <span className="profile-stat"><Heart /> 0 Favorites</span>
            <span className="profile-stat"><Eye /> 103K Post Views</span>
          </div>
        </div>
      </section>

      <div className="profile-shell">
        <nav className="profile-tabs" aria-label="Profile sections">
          {['Posts', 'Favorites', 'Comments'].map((tab) => (
            <button key={tab} className={tab === 'Posts' ? 'active' : ''} type="button">
              {tab}
            </button>
          ))}
        </nav>

        <section className="profile-content">
          <div className="folder-row">
            <div className="folder-item">
              <FolderPlus />
              <span>Create Folder</span>
            </div>
            <div className="folder-item">
              <Folder />
              <span>All</span>
            </div>
            <div className="folder-item active">
              <Folder />
              <span>Unorganized</span>
            </div>
          </div>

          <h2 className="profile-section-title">Unorganized</h2>

          <div className="profile-tools">
            <div className="profile-control">All</div>
            <label className="profile-control">
              <Search />
              <input type="search" placeholder="Search..." />
            </label>
            <div className="profile-muted-icon">
              <VideoOff />
            </div>
            <div className="profile-control">Newest</div>
          </div>

          <div className="profile-gallery">
            {tiles.map((tile, index) => (
              <article className="gallery-tile" key={tile + index}>
                <img src={tile} alt="" />
                <span className="gallery-check" aria-hidden="true" />
                <span className="gallery-delete" aria-hidden="true"><Trash2 /></span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Profile
