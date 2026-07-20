import { useState, useMemo } from "react";

function useEchoFilter(echoes) {
  const [echo, setEcho] = useState([])
  const [search, setSearch] = useState("")
  
  const toggle = (setter) => (value) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )
  }

  const filteredEchoes = useMemo(() => {
    const stringSearch = search.toLowerCase();

    return echoes.filter((echoItem) => {
      
      const matchesSearch =
        echoItem.id?.toString().includes(stringSearch) ||
        echoItem.name?.toLowerCase().includes(stringSearch) ||
        echoItem.element?.toLowerCase().includes(stringSearch) ||
        echoItem.sets?.some((set) =>
          set.name?.toLowerCase().includes(stringSearch)
        )

      const selected = echo.map((name) => name.toLowerCase());

      const matchesEchoType =
        selected.length === 0 ||
        echoItem.sets?.some((set) =>
          selected.includes(set.Name?.toLowerCase())
        );

      return (
        matchesEchoType && matchesSearch
      )
    })

  }, [echoes, echo, search])

  return {
    filteredEchoes,
    itemCount: filteredEchoes.length,

    search,
    setSearch,

    echo,
    setEcho,

    toggleEcho: toggle(setEcho)
  }
}

export default useEchoFilter