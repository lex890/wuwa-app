
function OptionsModal({ close }) {
  return (
    <div onClick={close} className={`modal-overlay`}>
      <div className="dropdown-content view-card">
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
      
  );
}

export default OptionsModal