import './Home.scss'
import Header from "../../../components/Header.jsx"
import Card from "../../../components/Card.jsx"

import CharacterIcon from '../../../../src/assets/components/CharacterIcon.jsx'
import WeaponIcon from '../../../assets/components/WeaponIcon.jsx'
import EchoesIcon from '../../../assets/components/EchoIcon.jsx'

import { useState } from 'react'


function Home(props) {
  const { characters, weapons, echoes } = props.data;

  const [dbState, setDBState] = useState([])

  return(
    <>      
      <Header text={"Admin / Home"}/>
      <div className="card-container">
        <Card 
          Icon={CharacterIcon} 
          name={"Users"} 
          amount={characters.length}
        />
        <Card 
          Icon={CharacterIcon} 
          name={"Characters"} 
          amount={characters.length}
        />
        <Card 
          Icon={WeaponIcon} 
          name={"Weapons"} 
          amount={weapons.length}
        />
        <Card 
          Icon={EchoesIcon} 
          name={"Echoes"} 
          amount={echoes.length}
        />
      </div>
    </>
  )
}

export default Home