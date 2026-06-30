import Header from "../../../components/Header"
import LineSeparator from "../../../components/LineSeparator"
import Footer from "../../../components/Footer"
import Search from "../../../components/Search"
import Filter from "./Filter"
import CardGrid from "./CardGrid"



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