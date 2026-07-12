import { Form } from "@/components"

function EditModal({ data, close }) {
  
  return(
    <div onClick={close} className={`modal-overlay`}>
      <div 
        className="modal-popup view-card" 
        style= {{"--accent-color": "var(--main)"}}
        onClick={(e) => e.stopPropagation()}
      >
        <Form data={data} close={close} />
      </div>
    </div>
  )
}

export default EditModal