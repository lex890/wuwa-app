import './SideBar.scss'
import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Anchor from './Anchor/Anchor.jsx'
import Title from './Anchor/Title.jsx'
import HomeIcon from '../../assets/components/HomeIcon.jsx'
import CharIcon from '../../assets/components/CharacterIcon.jsx'
import WeaponIcon from '../../assets/components/WeaponIcon.jsx'
import EchoesIcon from '../../assets/components/EchoIcon.jsx'
import TierListIcon from '../../assets/components/TierlistIcon.jsx'
import TeamTierListIcon from '../../assets/components/TeamTierListIcon.jsx'
import { navigateWithTransition } from '../../utils/viewTransition.js'
import { supabase } from '../../api/supabase.js'

function SideBar() {
  const navigate = useNavigate()
  const [account, setAccount] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadAccount = async (session) => {
      const user = session?.user

      if (!user) {
        if (isMounted) setAccount(null)
        return
      }

      const { data } = await supabase
        .from('users')
        .select('uname,email,avatar,role')
        .eq('id', user.id)
        .maybeSingle()

      if (!isMounted) return

      setAccount({
        email: user.email,
        uname: data?.uname || user.user_metadata?.uname || user.email?.split('@')[0] || 'User',
        avatar: data?.avatar || user.user_metadata?.avatar_url || '',
        role: data?.role || 'user',
      })
    }

    supabase.auth.getSession().then(({ data }) => {
      loadAccount(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadAccount(session)
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLoginClick = (event) => {
    event.preventDefault()
    navigateWithTransition(navigate, '/login', 'fade')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('wuwa_user')
    setAccount(null)
    navigateWithTransition(navigate, '/home', 'fade')
  }

  const handleProfileClick = () => {
    navigateWithTransition(navigate, '/profile', 'fade')
  }

  return(
    <>
      <aside id="side-bar">
        <Title />
        <Anchor Image={HomeIcon} text={'Home'} to={"home"}/>
        <span>DATABASE</span>
        <Anchor Image={CharIcon} text={'Resonators'} to={"character"}/>
        <Anchor Image={WeaponIcon} text={'Weapons'} to={"weapon"}/>
        <Anchor Image={EchoesIcon} text={'Echoes'} to={"echo"}/>
        <span>TIER LISTS</span>
        <Anchor Image={TierListIcon} text={'Tier List'} to={"tier-list"}/>
        <Anchor Image={TeamTierListIcon} text={'Tier List Maker'} to={"tier-builder"}/>
        <div className="sidebar-account-wrapper">
          {account ? (
            <div className="sidebar-account">
              <button type="button" className="sidebar-user" onClick={handleProfileClick}>
                {account.avatar ? (
                  <img src={account.avatar} alt="" />
                ) : (
                  <div className="avatar-fallback" aria-hidden="true">
                    {account.uname.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <strong>{account.uname}</strong>
                  <button
                    type="button"
                    className="logout-text"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleLogout()
                    }}
                  >
                    Logout
                  </button>
                </div>
              </button>
            </div>
          ) : (
            <NavLink className="login-button" to="/login" onClick={handleLoginClick}>
              Login
            </NavLink>
          )}
        </div>
      </aside>
    </>
  ) 
}

export default SideBar
