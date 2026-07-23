import { Add } from "@/assets/components"
import { useEcho } from "@/hooks/Admin/useEcho"

function AddButton() {
  const { openModal } = useEcho()

  return(
    <button 
      className="circle-button" 
      onClick={() => openModal("add")}
    >
      <Add size={"16px"} stroke="white"/> Add
    </button>
  )
}

export default AddButton