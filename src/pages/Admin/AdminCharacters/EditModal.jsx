import EditForm from "./EditForm"
import EditPreview from "./EditPreview"
import { useState } from "react"
// import { LineSeparator } from "@/components"
import useModalData from "@/hooks/Admin/useModalData"

function EditModal({ data, close }) {
  console.log(data)
  if (!data) ( <div> data not found. . . </div> )
  const { meta, assets } = useModalData(data)
  const [ mode, setMode ] = useState("preview")
  console.log(meta)
  console.log(assets)
  return(
    <div onClick={close} className={`modal-overlay`}>
      <div 
        className="edit-modal modal-popup view-card" 
        style= {{"--accent-color": "var(--main)"}}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{meta.name}</h3>
          <span>Character Metadata</span>
        </div>
        <hr />
        <div className="modal-content">
          <div className="modal-nav">
            <span 
              onClick={() => setMode("preview")}
              className={ mode === "preview" ? "active" : "" }
            >
              Preview
            </span>
            <span 
              onClick={() => setMode("edit")}
              className={ mode === "edit" ? "active" : "" }
            >
              Edit
            </span>
          </div>
          <div 
            className="modal-contents"
          >
            { mode === "preview" && 
              <EditPreview data={meta} assets={assets}/> }
            { mode === "edit" && 
              <EditForm data={meta}/> }
          </div>
        </div>
        <hr />
        <div className="modal-buttons">
          { mode === "preview" &&
            <button onClick={close}>Close</button>
          }
          { mode === "edit" && 
            <>
              <button type="submit">Save</button>
              <button onClick={close}>Cancel</button> 
            </> 
          }
        </div>
      </div>
    </div>
  )
}

export default EditModal