import './index.scss'
import { Header } from '@/components'
import { useGameData } from '@/hooks/Public/useGameData'
import LineSeparator from "../../../components/LineSeparator"
import { EchoFilterProvider } from './EchoFilterProvider'
import Filter from './Filter'
import Content from './Content'
import Search from './Search'


function Echoes() {
  const { echoes, loadData, loading } = useGameData();

  if (loading) return <p>Loading...</p>;
  console.log(echoes)
  return (
    <EchoFilterProvider data={echoes} loadData={loadData}>
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