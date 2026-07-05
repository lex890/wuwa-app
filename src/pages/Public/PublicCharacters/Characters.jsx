import Header from "../../../components/Header"
import LineSeparator from "../../../components/LineSeparator"

import Search from "../../../components/Search"
import Filter from "./Filter"
import CardGrid from "./CardGrid"

import { useState } from "react"

function Characters({ data }) {
  
  const [ element, setElement ] = useState([])
  const [ weapon, setWeapon ] = useState([])
  const [ rarity, setRarity ] = useState([])

  console.log(data)

  return (
    <>
      <Header />
      <Filter />
      <Search />
      <LineSeparator />
      <CardGrid data={data}/> 
    </>
  )
}

export default Characters