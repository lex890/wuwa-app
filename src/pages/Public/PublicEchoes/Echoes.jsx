import './index.scss'
import { Header } from '@/components'
import { useGameData } from '@/hooks/Public/useGameData'

function Echoes() {
  const { echoes, loading } = useGameData()
  if (loading) return <p>Loading...</p>
  console.log(echoes)
  return(
    <>      
      <div className="echoes-container">
        <Header />
        <Filter 
          set={echoes}
          toggleSet={toggleWeapon}
          rarity={rarity} 
          toggleRarity={toggleRarity}
        />
      </div>
    </>
  )
}

export default Echoes