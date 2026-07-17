import './index.scss'
import { useGameData } from '@/hooks/Public/useGameData';
import { Header } from '@/components';

function Weapons() {
  const { weapons, loading } = useGameData()
  if (loading) return <p>Loading...</p>
  
  console.log(weapons)
  return(
    <>      
      <div id="weapons-container">
        <Header />

      </div>
    </>
  )
}

export default Weapons