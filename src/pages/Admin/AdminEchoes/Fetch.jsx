import { Fetch } from "@/assets/components"
import { useEcho } from "@/hooks/Admin/useEcho"

function FetchButton() {
  const { actions } = useEcho()
  return(
    <button 
      className="circle-button"
      onClick={actions.reload}
    >
      <Fetch size={"16px"} stroke="white"/> Fetch
    </button>
  )
}

export default FetchButton