import './SideBar.scss'
import Anchor from './Anchor/Anchor.jsx'
import HomeIcon from '../../assets/components/HomeIcon.jsx'
import CharIcon from '../../assets/components/CharacterIcon.jsx'
import WeaponIcon from '../../assets/components/WeaponIcon.jsx'
import GearIcon from '../../assets/components/GearIcon.jsx'
import TierListIcon from '../../assets/components/TierlistIcon.jsx'
import TeamTierListIcon from '../../assets/components/TeamTierListIcon.jsx'

function SideBar() {
  return(
    <>
      <nav id="side-bar">
        <Anchor Image={HomeIcon} text={'Home'}/>
        <span>DATABASE</span>
        <Anchor Image={CharIcon} text={'Characters'}/>
        <Anchor Image={WeaponIcon} text={'Weapons'}/>
        <Anchor Image={GearIcon} text={'Home'}/>
        <span>TIER LISTS</span>
        <Anchor Image={TierListIcon} text={'Tier List'}/>
        <Anchor Image={TeamTierListIcon} text={'Tier List Maker'}/>
      </nav>
    </>
  ) 
}

export default SideBar

