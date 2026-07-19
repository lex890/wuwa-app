import './index.scss'
import { Header } from '@/components'
import { useGameData } from '@/hooks/Public/useGameData'
import LineSeparator from "../../../components/LineSeparator"
import { EchoFilterProvider } from './EchoFilterProvider'
import Filter from './Filter'
import Content from './Content'
import Search from './Search'


function Echoes() {
  const { echoes, loading } = useGameData();

  if (loading) return <p>Loading...</p>;
  console.log(echoes)
  return (
    <EchoFilterProvider data={echoes}>
      <div id="echoes-container">
        <Header />
        <Filter />
        <Search />
        <LineSeparator />
        <Content />
      </div>
    </EchoFilterProvider>
  );
}

export default Echoes