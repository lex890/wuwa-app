import './Echoes.scss'
import { useGameData } from '@/hooks/Public/useGameData'
import ErrorPage from '@/assets/components/ErrorPage'
import { Header, LineSeparator } from '../../../components/index'
import { EchoFilterProvider } from './EchoFilterProvider'
import Tools from './Tools'
import Content from './Content'
import Modals from './Modals'
import StatusMsg from './StatusMsg'

function Echoes() {
  const { 
    echoes,
    loadData, 
    loading,
    error 
  } = useGameData()

  if (error) return <ErrorPage />
  if (loading) return <p>Loading...</p>
  console.log(echoes)

  return(
    <EchoFilterProvider data={echoes} loadData={loadData}>
      <div id="echoes-container">
        <Header/>
        <LineSeparator />
        <Tools />
        <Content />
        <StatusMsg/>
      </div>
      <Modals />  
    </EchoFilterProvider>
  )
}

export default Echoes