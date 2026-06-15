import './SideBar.scss'
import Anchor from './Anchor/Anchor.jsx'
import Title from './Anchor/Title.jsx'
import HomeIcon from '../../assets/components/HomeIcon.jsx'
import CharIcon from '../../assets/components/CharacterIcon.jsx'
import WeaponIcon from '../../assets/components/WeaponIcon.jsx'
import EchoesIcon from '../../assets/components/EchoIcon.jsx'
import TierListIcon from '../../assets/components/TierlistIcon.jsx'
import TeamTierListIcon from '../../assets/components/TeamTierListIcon.jsx'

function SideBar() {
  return(
    <>
      
      <nav id="side-bar">
        <Title />
        <Anchor Image={HomeIcon} text={'Home'}/>
        <span>DATABASE</span>
        <Anchor Image={CharIcon} text={'Characters'} to={"/character"}/>
        <Anchor Image={WeaponIcon} text={'Weapons'} to={"/weapon"}/>
        <Anchor Image={EchoesIcon} text={'Echoes'} to={"/echo"}/>
        <span>TIER LISTS</span>
        <Anchor Image={TierListIcon} text={'Tier List'}/>
        <Anchor Image={TeamTierListIcon} text={'Tier List Maker'}/>
      </nav>
    </>
  ) 
}

export default SideBar

