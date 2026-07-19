import AddForm from "./AddForm"



function AddModal({ close, addData }) {

  return(
    <div onClick={close} className={`modal-overlay`}>
      <div 
        className="chat-modal modal-popup view-card" 
        style= {{"--accent-color": "var(--main)"}}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="chat-header">
          <h2>Add Character</h2>
          <button onClick={close}>✕</button>
        </div>

        <div className="chat-body">
          <AddForm
            handleClose={close}
            addData={addData}
          />
        </div>
      </div>
    </div>
  )
}

export default AddModal