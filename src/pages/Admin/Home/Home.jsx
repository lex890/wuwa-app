import './Home.scss'
import Header from "../../../components/Header.jsx"
import Card from "../../../components/Card.jsx"

import CharacterIcon from '../../../../src/assets/components/CharacterIcon.jsx'
import WeaponIcon from '../../../assets/components/WeaponIcon.jsx'
import EchoesIcon from '../../../assets/components/EchoIcon.jsx'
import TierListIcon from '../../../assets/components/TierlistIcon.jsx'
import TeamTierListIcon from '../../../assets/components/TeamTierListIcon.jsx'
// import { useState } from 'react'


function Home(props) {
  const { characters, weapons, echoes } = props.data;

  // const [dbState, setDBState] = useState([])

  return(
    <>      
      <Header />
      <div className="card-container">
        <div className="card-group">
          <h2>System</h2>
          <div className="grid-container">
            <Card 
              Icon={CharacterIcon} 
              name={"Users"} 
              amount={characters.length}
            />
            <Card 
              Icon={CharacterIcon} 
              name={"Admin"} 
              amount={"1"}
            />
            <Card 
              Icon={CharacterIcon} 
              name={"Super Admin"} 
              amount={"1"}
            />
            
          </div>
        </div>
        <div className="card-group">
          <h2>Database</h2>
          <div className="grid-container">
            <Card 
              Icon={CharacterIcon} 
              name={"Characters"} 
              amount={characters.length}
              to={"/admin/character"}
            />
            <Card 
              Icon={WeaponIcon} 
              name={"Weapons"} 
              amount={weapons.length}
              to={"/admin/weapon"}
            />
            <Card 
              Icon={EchoesIcon} 
              name={"Echoes"} 
              amount={echoes.length}
              to={"/admin/echo"}
            />
          </div>
        </div>
        <div className="card-group">
          <h2>Tierlists</h2>
          <div className="grid-container">
            <Card 
              Icon={TierListIcon} 
              name={"TierList"} 
              amount={characters.length}
            />
            <Card 
              Icon={TeamTierListIcon} 
              name={"User Tierlist"} 
              amount={weapons.length}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home