import "./Admin.scss"
import NavBar from "../../components/NavBar/NavBar"
import SideBar from "../../components/SideBar/SideBar"
import { Outlet } from "react-router-dom"

export default function Admin() {
  return (
    <div className="admin">
      <NavBar />
      <SideBar />
      <div className="content">
        <div className="main-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
