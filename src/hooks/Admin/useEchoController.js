import useEchoFilter from "../Public/useEchoFilter"

function useEchoController(data, loadData) {
  const {
    filteredEchoes,
    itemCount,
    search,
    setSearch,
    echo,
    setEcho,
    toggleEcho
  } = useEchoFilter(data)

  return {
    filteredEchoes,
    itemCount,
    search,
    setSearch,
    echo,
    setEcho,
    toggleEcho
  }
}

export default useEchoController