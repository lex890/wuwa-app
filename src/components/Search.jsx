import SearchIcon from "../assets/components/SearchIcon"

function Search({ search, setSearch }) {
  return(
    <>
        <div className="search-section">
          <SearchIcon width={"20px"} height={"20px"}/>
          <input 
            type="text" id="characterSearch" placeholder="Search..." autoComplete="off"
              value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
          
    </>
  )

}

export default Search