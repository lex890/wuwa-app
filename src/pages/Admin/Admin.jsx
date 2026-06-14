import './Admin.scss'
import NavBar from '../../components/NavBar/NavBar'
import SideBar from '../../components/SideBar/SideBar'
import { Outlet } from "react-router-dom";

function Admin() {
  return(
    <>
      <div className="admin">
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

export default Admin

/*
if (!character) return <p>Loading...</p>;
<div>Hi welcome to admin</div>
<ul>
  {data.map(i => {
    return <li>{i.name}</li>
  })}
</ul>

*/