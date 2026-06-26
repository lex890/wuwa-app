import Header from "../../../components/Header"
import LineSeparator from "../../../components/LineSeparator"
import Filter from "../../../components/Filter"
import CardGrid from "../../../components/CardGrid"
import Footer from "../../../components/Footer"
import Search from "../../../components/Search"


function Characters({ data }) {
  console.log(data)

  return (
    <>
      <Header />
      <LineSeparator />
      <Filter />
      <Search />
      <CardGrid data={data}/>
      <Footer />  
    </>
  )
}

export default Characters