import './NavBar.scss'
import Minimize from '../../assets/components/Minimize.jsx'
// import Title from '../SideBar/Anchor/Title.jsx'

function NavBar() {
  return(
    <> 
      <div id="nav-bar">
        {/* <Title />  di kasya pag mobile view*/}
        <Minimize />
      </div>
    </>
  ) 
}

export default NavBar