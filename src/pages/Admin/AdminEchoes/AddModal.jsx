import AddForm from "./AddForm"
import { useEcho } from "@/hooks/Admin/useEcho"

function AddModal() {

  const { closeModal } = useEcho()

  return(
    <div onClick={closeModal} className={`modal-overlay`}>
      <div 
        className="chat-modal modal-popup view-card" 
        style= {{"--accent-color": "var(--main)"}}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="chat-header">
          <h2>Add Character</h2>
          <button onClick={closeModal}>✕</button>
        </div>

        <div className="chat-body">
          <AddForm />
        </div>
      </div>
    </div>
  )
}

export default AddModal