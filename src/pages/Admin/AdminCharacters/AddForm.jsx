import ImageUpload from "@/components/ImageUpload"
import useCharacterForm from "@/hooks/Admin/useCharacterForm";


function AddForm({ handleClose, addData }) {
  
  const { handleSubmit } = useCharacterForm(addData)

  return(
    <>
      <form id="addForm" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" />

        <label htmlFor="element_type">Element</label>
        <select id="element_type" name="element_type">
          <option value="Glacio">Glacio</option>
          <option value="Fusion">Fusion</option>
          <option value="Electro">Electro</option>
          <option value="Aero">Aero</option>
          <option value="Spectro">Spectro</option>
          <option value="Havoc">Havoc</option>
        </select>

        <label htmlFor="weapon_type">Weapon Type</label>
        <select id="weapon_type" name="weapon_type">
          <option value="Sword">Sword</option>
          <option value="Broadblade">Broadblade</option>
          <option value="Pistols">Pistols</option>
          <option value="Gauntlets">Gauntlets</option>
          <option value="Rectifier">Rectifier</option>
        </select>

        <label htmlFor="quality_id">Quality</label>
        <select id="quality_id" name="quality_id">
          <option value={4}>★★★★</option>
          <option value={5}>★★★★★</option>
        </select>

        <hr />
        <div>
          <ImageUpload label={"Character Icon"} name={"icon"}/>
          <ImageUpload label={"Role Portrait"}  name={"rolePortrait"}/>
          <ImageUpload label={"Role Head Icon"} name={"roleHeadIcon"}/>
          <ImageUpload label={"Formation Card"} name={"formationCard"}/>
        </div>

      </form>

      <div className="actions">
        <button type="submit" form="addForm">
          Create
        </button>

        <button type="button" onClick={handleClose}>
          Cancel
        </button>
      </div>
    </>
  )
}

export default AddForm