

function EditForm({ data }) {
  // console.log(data)
  const handleSubmit = () => {
    console.log("submit this")
  }
  
  return(
    <>
      <form onSubmit={handleSubmit} className="preview-grid">
        <div>
          <h3>ID</h3>
          <span>{data.id}</span>
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
          <input
            id="element"
            name="element"
            type="text"
            defaultValue={data.element}
          />
        </div>

        <div>
          <label htmlFor="weapon">
            <h3>Weapon Type</h3>
          </label>
          <input
            id="weapon"
            name="weapon"
            type="text"
            defaultValue={data.weapon}
          />
        </div>

        <div>
          <label htmlFor="quality">
            <h3>Quality</h3>
          </label>
          <input
            id="quality"
            name="quality"
            type="number"
            defaultValue={data.quality}
          />
        </div>

        <div>
          <h3>Created at</h3>
          <span>{data.date}</span>
        </div>

      </form>
    </>
  )
}

export default EditForm