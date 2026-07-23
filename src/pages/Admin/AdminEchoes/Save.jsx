import SaveIcon from "@/assets/components/Save"
import { useEcho } from "@/hooks/Admin/useEcho"

function Save() {
  const { actions } = useEcho()
  return(
    <button 
      className="circle-button"
      onClick={actions.save}
    >
      <SaveIcon size={"16px"} stroke="white"/> Save
    </button>
  ) 
}

export default Save