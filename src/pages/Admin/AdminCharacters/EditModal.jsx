import EditForm from "./EditForm"
import EditPreview from "./EditPreview"

import CloseButton from "../../../assets/svg/close-button.svg"
import DeleteButton from "../../../assets/svg/delete-button.svg"

import { useState } from "react"
import useModalData from "@/hooks/Admin/useModalData"
import useCharacterForm from "@/hooks/Admin/useCharacterForm"

function EditModal({ data, close, editData }) {
  if (!data) ( <div> data not found. . . </div> )
  const { meta, assets } = useModalData(data)
  const [ mode, setMode ] = useState("preview")
  const { handleSubmit } = useCharacterForm(editData)
  return(
    <div onClick={close} className="modal-overlay">
      <div 
        className="edit-modal modal-popup view-card" 
        style= {{"--accent-color": "var(--main)"}}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="close-button" onClick={close}>
          <img src={CloseButton} alt="" />
        </div>
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
              <EditPreview 
                data={meta} 
                assets={assets}
              />
            }
            { mode === "edit" && 
              <EditForm 
                data={meta} 
                handleSubmit={handleSubmit}
              /> 
            }
          </div>
        </div>
        <hr />
        <div className="modal-buttons">
          { mode === "preview" &&
            <>
              <button className="delete-button">
                <img src={DeleteButton} alt="" />
              </button>
            </>
          }
          { mode === "edit" && 
            <>
              <button type="submit" form="edit-form">Save</button>
              <button onClick={close}>Cancel</button> 
            </> 
          }
        </div>
      </div>
    </div>
  )
}

export default EditModal