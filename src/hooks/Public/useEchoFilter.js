import { useState, useMemo } from "react";

function useEchoFilter(echo) {
  const [ search, setSearch ] = useState("")
  const [ echoSet, setEchoSet ] = useState([])
  
  const toggleEchoSet = (newItem) => {
    setEchoSet(prev =>
      prev.includes(newItem)
        ? prev.filter(item => item !== newItem)
        : [...prev, newItem]
    )
  }

  const filteredEchoes = useMemo(() => {
    const stringSearch = 
      search.toLowerCase();
    const selected = 
      echoSet.map((set) => set.toLowerCase());
    console.log(selected.length)
    return echo.filter((echoItem) => {
      const matchesSearch =
        echoItem.id?.toString().includes(stringSearch) ||
        echoItem.name?.toLowerCase().includes(stringSearch) ||
        echoItem.element?.toLowerCase().includes(stringSearch) ||
        echoItem.sets?.some((set) =>
          set.name?.toLowerCase().includes(stringSearch)
        )
      const matchesEchoType =
        selected.length === 0 ||
        echoItem.sets?.some((set) =>
          selected.includes(set.Name?.toLowerCase())
        );

      return (
        matchesEchoType && matchesSearch
      )
    })

  }, [echo,echoSet,search])

  return {
    filteredEchoes,
    echoSet,
    toggleEchoSet,
    search,
    setSearch,
  }
}

export default useEchoFilter