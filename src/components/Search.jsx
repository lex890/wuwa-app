import SearchIcon from "../assets/components/SearchIcon"

function Search({ search, setSearch }) {
  return(
    <>
          <div className="search">
            <SearchIcon width={"20px"} height={"20px"}/>
            <input 
              type="text" id="characterSearch" placeholder="Search..." autocomplete="off"
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
    </>
  )

}

export default Search