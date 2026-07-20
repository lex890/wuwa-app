import { Add } from "@/assets/components"

function AddButton() {
  return(
    <button 
      className="circle-button"
      // onClick={actions.save}
    >
      <Add size={"16px"} stroke="white"/> Add
    </button>
  )
}

export default AddButton