import './Public.scss'
import NavBar from '../../components/NavBar/NavBar'
import SideBar from '../../components/SideBar/SideBar'

import { Outlet } from "react-router-dom";


function Public() {
  
  return(
    <>
      <div className="public">
        <NavBar />
        <SideBar />

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