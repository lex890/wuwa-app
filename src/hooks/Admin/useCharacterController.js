import useCharacterData from '@/hooks/Admin/useCharacterData'
import useNotification from '@/hooks/Admin/useNotification'
import usePagination from '@/hooks/Admin/usePagination'
import useSearch from '@/hooks/Admin/useSearch'
import useModal from '@/hooks/Admin/useModal'

function useCharacterController(data, loadData) {
  const {
    characters,
    actions,
  } = useCharacterData(data, loadData)
  const { 
    filterChar, 
    searchTerm, 
    setSearchTerm, 
  } = useSearch(characters)
  const { 
    page,
    navigate
  } = usePagination(filterChar)
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
  const add = (newChar) => {
    const { message, type } = actions.add(newChar);
    showMessage(message, type)
    closeModal()
  }
  const update = (newChar) => {
    const { message, type } = actions.update(newChar);
    showMessage(message, type)
    closeModal()
  }

  return {
    filterChar,
    page,
    navigate,
    searchTerm,
    setSearchTerm,
    modal,
    openModal,
    closeModal,
    notif,

    actions: {
      ...actions,
      reload,
      update,
      save,
      add
    },
  };
}

export default useCharacterController