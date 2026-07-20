import './Weapons.scss'
import { useGameData } from '@/hooks/Public/useGameData'
import ErrorPage from '@/assets/components/ErrorPage'
import { Header, LineSeparator } from '../../../components/index'
import { WeaponFilterProvider } from './WeaponsFilterProvider'
import Tools from './Tools'
import Content from './Content'

function Weapons() {
  const { 
    weapons, 
    loading,
    error 
  } = useGameData()

  if (error) return <ErrorPage />
  if (loading) return <p>Loading...</p>
  console.log(weapons)

  return(
    <WeaponFilterProvider data={weapons}>
      <div id="echoes-container">
        <Header/>
        <LineSeparator />
        <Tools />
        <Content />
      </div>  
    </WeaponFilterProvider>
  )
}


export default Weapons