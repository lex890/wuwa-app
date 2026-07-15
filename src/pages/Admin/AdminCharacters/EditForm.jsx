

function EditForm({ data, handleSubmit }) {
  return(
    <>
      <form 
        id="edit-form"
        onSubmit={handleSubmit} 
        className="preview-grid-edit"
      >
        <div>
          <h3>ID</h3>
          <span>{data.id}</span>
        </div>

        <div>
          <h3>Created at</h3>
          <span>{data.date}</span>
        </div>

        <div>
          <label htmlFor="name">
            <h3>Name</h3>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={data.name}
          />
        </div>

        <div>
          <label htmlFor="element">
            <h3>Element Type</h3>
          </label>
          <select id="element" name="element">
            <option value="Glacio">Glacio</option>
            <option value="Fusion">Fusion</option>
            <option value="Electro">Electro</option>
            <option value="Aero">Aero</option>
            <option value="Spectro">Spectro</option>
            <option value="Havoc">Havoc</option>
          </select>
        </div>

        <div>
          <label htmlFor="weapon">
            <h3>Weapon Type</h3>
          </label>
          <select id="weapon" name="weapon">
            <option value="Sword">Sword</option>
            <option value="Broadblade">Broadblade</option>
            <option value="Pistols">Pistols</option>
            <option value="Gauntlets">Gauntlets</option>
            <option value="Rectifier">Rectifier</option>
          </select>
        </div>

        <div>
          <label htmlFor="quality">
            <h3>Quality</h3>
          </label>
          <select id="quality" name="quality">
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>

      </form>
    </>
  )
}

export default EditForm