import './Modal.scss'

function Modal({ hidden, Content }) {
  return(
    <>
      <div className={`modal-overlay ${hidden ? '' : 'hide'}`}>

        <div className="modal-popup view-card" style={{"--accent-color": "var(--main)"}}>
          { Content }
        </div>

      </div>

    </>
  )
}

export default Modal