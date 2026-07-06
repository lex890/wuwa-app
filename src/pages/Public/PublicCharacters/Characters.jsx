import Header from "../../../components/Header"
import LineSeparator from "../../../components/LineSeparator"

import Search from "../../../components/Search"
import Filter from "./Filter"
import CardGrid from "./CardGrid"

import { useState } from "react"

function Characters({ data }) {
  // search state
  const [search, setSearch] = useState("")

  const [ element, setElement ] = useState([])
  const [ weapon, setWeapon ] = useState([])
  const [ rarity, setRarity ] = useState([])

  // filter 'data' through state filters
  const filterData = data.filter((char) => {
    const stringSearch = search.toLowerCase()

    const matchesSearch =
      char.id.toString().includes(stringSearch) ||
      char.name?.toLowerCase().includes(stringSearch) ||
      char.elemen_type?.toLowerCase().includes(stringSearch) ||
      char.weapon_type?.toLowerCase().includes(stringSearch)

    const matchesElement =
      element.length === 0 || element.includes(char.elemen_type);

    const matchesWeapon =
      weapon.length === 0 || weapon.includes(char.weapon_type);

    const matchesRarity =
      rarity.length === 0 || rarity.includes(char.quality_id);

    return (
      matchesSearch &&
      matchesElement &&
      matchesWeapon &&
      matchesRarity
    )
  })

  const toggleElement = (value) => {
    setElement((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )
  }

  const toggleWeapon = (value) => {
    setWeapon((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )
  }

  const toggleRarity = (value) => {
    setRarity((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )
  }

  return (
    <>
      <div id="characters-container">
        <Header />
        <Filter
          element={element}
          weapon={weapon}
          rarity={rarity} 
          setElement={toggleElement}
          setWeapon={toggleWeapon}
          setRarity={toggleRarity}
        />
        <div className="flex-start-row">
          <Search 
            search={search} 
            setSearch={setSearch}
          />
          <span id="total">Total {filterData.length}</span>
        </div>
        
        <LineSeparator />
        <CardGrid data={filterData}/> 
      </div>
    </>
  )
}

export default Characters