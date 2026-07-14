import { DotsIcon } from "@/assets/components";

function OptionsButton({ open }) {
  return(
    <div className="dropdown">
      <button 
        onClick={open}
        className="dropbtn"
      >
        <DotsIcon />
      </button>
    </div>
  )
}

export default OptionsButton