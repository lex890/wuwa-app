import "./index.scss"

import Header from "../../../components/Header"
import LineSeparator from "../../../components/LineSeparator"
import Search from "../../../components/Search"
import Filter from "./Filter"
import CardGrid from "./CardGrid"
import { ErrorPage } from "../PublicCharacterDetails"

import { useGameData } from "@/hooks/Public/useGameData"
import { useCharacterFilters } from "@/hooks/Public/useCharacterFilter"

function Characters() {
  const { characters, loading, error } = useGameData()
  
  const {
    filteredCharacters,
    search,
    setSearch,
    element,
    weapon,
    rarity,
    toggleElement,
    toggleWeapon,
    toggleRarity,
  } = useCharacterFilters(characters);

  if (error) return <ErrorPage />
  if (loading) return <p>Loading...</p>

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
          <span id="total">Total {filteredCharacters.length}</span>
        </div>
        
        <LineSeparator />
        <CardGrid data={filteredCharacters}/> 
      </div>
    </>
  )
}

export default Characters