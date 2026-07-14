import AddForm from "./AddForm"

import uploadImage from "@/utils/imageParser";

function AddModal({ close, addData }) {
  async function submit(e) {
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
    <div onClick={close} className={`modal-overlay`}>
      <div 
        className="modal-popup view-card" 
        style= {{"--accent-color": "var(--main)"}}
        onClick={(e) => e.stopPropagation()}
      >
        <AddForm 
          handleSubmit={submit}
          handleClose={close}
        />
      </div>
    </div>
  )
}

export default AddModal