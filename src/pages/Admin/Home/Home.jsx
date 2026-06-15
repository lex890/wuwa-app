import './Home.scss'

function Home({ data }) {
  console.log('num of data: ', data.length)
  return(
    <>      
      <div className="header-container">
        <h1>Welcome, Admin!</h1>
      </div>
    </>
  )
}

export default Home