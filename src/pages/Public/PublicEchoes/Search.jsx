import { useEcho } from "@/hooks/Public/useEcho"
import SearchIcon from "@/assets/components/SearchIcon"

function Search() {

  const { search, setSearch, itemCount } = useEcho()

  return(
    <div className="search-section">
      <SearchIcon width={"20px"} height={"20px"}/>
      <input
        type="text"
        placeholder="Search echoes..."
        autoComplete="off"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <span>Total: {itemCount}</span>
    </div>
  ) 
}

export default Search