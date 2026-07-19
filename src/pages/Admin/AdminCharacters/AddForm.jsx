import ImageUpload from "@/components/ImageUpload"
import useCharacterForm from "@/hooks/Admin/useCharacterForm";


function AddForm({ handleClose, addData }) {
  const { handleSubmit } = useCharacterForm(addData);

  return (
    <form id="addForm" onSubmit={handleSubmit} className="chat-form">

      <div className="chat-bubble">
        <label>Name</label>
        <input name="name" />
      </div>

      <div className="chat-bubble">
        <label>Element</label>
        <select name="element_type">
          <option>Glacio</option>
          <option>Fusion</option>
          <option>Electro</option>
          <option>Aero</option>
          <option>Spectro</option>
          <option>Havoc</option>
        </select>
      </div>

      <div className="chat-bubble">
        <label>Weapon</label>
        <select name="weapon_type">
          <option>Sword</option>
          <option>Broadblade</option>
          <option>Pistols</option>
          <option>Gauntlets</option>
          <option>Rectifier</option>
        </select>
      </div>

      <div className="chat-bubble">
        <label>Quality</label>
        <select name="quality_id">
          <option value={4}>★★★★</option>
          <option value={5}>★★★★★</option>
        </select>
      </div>

      <div className="chat-bubble">
        <label>Images</label>

        <ImageUpload label="Character Icon" name="icon" />
        <ImageUpload label="Role Portrait" name="rolePortrait" />
        <ImageUpload label="Role Head Icon" name="roleHeadIcon" />
        <ImageUpload label="Formation Card" name="formationCard" />
      </div>

      <div className="chat-actions">
        <button type="button" onClick={handleClose}>
          Cancel
        </button>

        <button type="submit">
          Create
        </button>
      </div>
    </form>
  );
}

export default AddForm