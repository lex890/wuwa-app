import './index.scss'
import { useGameData } from '@/hooks/Public/useGameData';
import { useWeaponFilters } from '@/hooks/Public/useWeaponFilter';
import Header from "../../../components/Header"
import LineSeparator from "../../../components/LineSeparator"
import Filter from './Filter';
import Search from './Search';
import Content from './Content';

function Weapons() {
  const { weapons, loading } = useGameData()
  const {
    filteredWeapons,
    search,
    setSearch,
    weapon,
    rarity,
    toggleWeapon,
    toggleRarity,
  } = useWeaponFilters(weapons);

  if (loading) return <p>Loading...</p>
  
  console.log(weapons)
  return(
    <div id="weapons-container">
      <Header />
      <Filter 
        weapon={weapon}
        toggleWeapon={toggleWeapon}
        rarity={rarity} 
        toggleRarity={toggleRarity}
      />
      <Search
        search={search} 
        setSearch={setSearch}
      />
      <LineSeparator />
      <Content 
        data={filteredWeapons}
      />
    </div>
  )
}

export default Weapons