import ImageUpload from "@/components/ImageUpload"
import uploadImage from "@/utils/imageParser";

function AddForm({ handleClose, addData }) {
  async function handleSubmit(e) {
    e.preventDefault();
    // const id = in the database
    const formData = new FormData(e.currentTarget);

    const name = formData.get("name");
    const elementType = formData.get("element_type");
    const weaponType = formData.get("weapon_type");
    const qualityId = Number(formData.get("quality_id"));

    const icon = formData.get("icon");
    const rolePortrait = formData.get("rolePortrait");
    const roleHeadIcon = formData.get("roleHeadIcon");
    const formationCard = formData.get("formationCard");

    // const timestamp = in the database
    const iconPath = await uploadImage(icon, "icons");
    const portraitPath = await uploadImage(rolePortrait, "portraits");
    const headPath = await uploadImage(roleHeadIcon, "heads");
    const formationPath = await uploadImage(formationCard, "formations");

    const newCharacter = {
      name,
      quality_id: qualityId,
      weapon_type: weaponType,
      elemen_type: elementType,
      icon: iconPath,
      icons: {
        FormationRoleCard: formationPath,
        RoleHeadIconBig: headPath,
        RolePortrait: portraitPath
      }
    }
    // add the obj to the localState
    addData(newCharacter)
  }
  
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