import { DotsIcon } from "@/assets/components";

function OptionsButton({ open }) {
  return(
    <div className="dropbtn">
      <button onClick={open}>
        <DotsIcon />
      </button>
    </div>
  )
}

export default OptionsButton