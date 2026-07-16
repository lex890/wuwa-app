import AddForm from "./AddForm"



function AddModal({ close, addData }) {

  return(
    <div onClick={close} className={`modal-overlay`}>
      <div 
        className="modal-popup view-card" 
        style= {{"--accent-color": "var(--main)"}}
        onClick={(e) => e.stopPropagation()}
      >
        <AddForm 
          handleClose={close}
          addData={addData}
        />
      </div>
    </div>
  )
}

export default AddModal