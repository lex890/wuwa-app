
function OptionsModal({ close, open, data }) {
  return (
    <div onClick={close} className="item-modal-overlay">
      <div 
        className="dropdown-content view-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={() => open("edit", data)}>Edit</button>
        <button onClick={close}>Delete</button>
      </div>
    </div>
      
  );
}

export default OptionsModal