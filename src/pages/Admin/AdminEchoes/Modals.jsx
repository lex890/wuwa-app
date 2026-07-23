import { useEcho } from "@/hooks/Admin/useEcho"

import EditModal from "../AdminCharacters/EditModal"
import AddModal from "./AddModal"

function Modals() {
  const { modal } = useEcho()
  return(
    <>
      { modal.type  === 'edit' && (
        <EditModal />
      )}
      { modal.type === 'add' && (
        <AddModal />
      )}
    </>
  )
}

export default Modals