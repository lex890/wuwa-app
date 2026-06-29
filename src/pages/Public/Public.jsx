import './Public.scss'
import NavBar from '../../components/NavBar/NavBar'
import SideBar from '../../components/SideBar/SideBar'

import { Outlet, useLocation } from "react-router-dom";


function Public() {
  const { pathname } = useLocation()
  const isUserAccessPage = ['/user-access', '/login', '/signup', '/forgot-pass', '/verify-email'].includes(pathname)
  
  return(
    <>
      <div className={isUserAccessPage ? 'public user-access-layout' : 'public'}>
        {!isUserAccessPage && <NavBar />}
        {!isUserAccessPage && <SideBar />}

        <div className="content">
          <div className="main-wrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default Public
