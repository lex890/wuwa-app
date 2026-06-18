import './Modal.scss'

function Modal({ hidden, Content }) {
  return(
    <>
      <div className={`modal-overlay ${hidden ? '' : 'hide'}`}>

        <div className="modal-popup">
          { Content }
        </div>

      </div>

    </>
  )
}

export default Modal