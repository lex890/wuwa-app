import './Echoes.scss'
import { useGameData } from '@/hooks/Public/useGameData'
import ErrorPage from '@/assets/components/ErrorPage'
import { Header, LineSeparator } from '../../../components/index'
import { EchoFilterProvider } from './EchoFilterProvider'
import Tools from './Tools'
import Content from './Content'

function Echoes() {
  const { 
    echoes, 
    loading,
    error 
  } = useGameData()

  if (error) return <ErrorPage />
  if (loading) return <p>Loading...</p>
  console.log(echoes)

  return(
    <EchoFilterProvider data={echoes}>
      <div id="echoes-container">
        <Header/>
        <LineSeparator />
        <Tools />
        <Content />
      </div>  
    </EchoFilterProvider>
  )
}

export default Echoes