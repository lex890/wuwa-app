import './NavBar.scss'
import Minimize from '../../assets/components/Minimize.jsx'
// import Title from '../SideBar/Anchor/Title.jsx'

function NavBar() {
  return(
    <> 
      <nav id="nav-bar">
        {/* <Title />  di kasya pag mobile view*/}
        <Minimize />
      </nav>
    </>
  ) 
}

export default NavBar