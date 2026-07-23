import useEchoFilter from "../Public/useEchoFilter"
import useEchoesData from "./useEchoesData"
import useNotification from "./useNotification"
import useModal from "./useModal"

function useEchoController(data, loadData) {
  const {
    echo,
    actions
  } = useEchoesData(data, loadData)
  const { 
    filteredEchoes,
    echoSet,
    toggleEchoSet,
    search,
    setSearch,
  } = useEchoFilter(echo)
  const { 
    notif, 
    showMessage 
  } = useNotification()
  const {
    modal,
    openModal,
    closeModal
  } = useModal()
  
  const reload = async () => {
    const { message, type } = await actions.reload();
    showMessage(message, type);
  }
  const save = async () => {
    const { message, type } = await actions.save();
    showMessage(message, type);
  }
  const add = (data) => {
    const { message, type } = actions.add(data);
    showMessage(message, type)
    closeModal()
  }
  const remove = (data) => {
    const { message, type } = actions.remove(data);
    showMessage(message, type)
  }
  const update = (data) => {
    const { message, type } = actions.update(data);
    showMessage(message, type)
    closeModal()
  }
  return {
    modal,
    notif,
    search,
    setSearch,
    echoSet,
    toggleEchoSet,
    openModal,
    closeModal,
    filteredEchoes,

    actions: {
      add,
      save,
      remove,
      reload,
      update,
    }
  }
}

export default useEchoController