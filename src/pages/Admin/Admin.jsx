import './Admin.scss'
import NavBar from '../../components/NavBar/NavBar'
import SideBar from '../../components/SideBar/SideBar'
import Content from './Content/Content.jsx'

function Admin({ data }) {
  console.log(data)
  return(
    <>
      <div className="admin">
        <NavBar />
        <SideBar />
        <Content />
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