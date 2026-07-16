function EditPreview({ data, assets }) {
  
  return(
    <>
      <img className="bg" src={assets.torso}/>
      <div className="preview-grid">
        <div>
          <h3>ID</h3>
          <span>{data.id}</span>
        </div>

        <div>
          <h3>Created at</h3>
          <span>{data.date}</span>
        </div>

        <div>
          <h3>Name</h3>
          <span>{data.name}</span>
        </div>

        <div>
          <h3>Element Type</h3>
          <span>{data.element}</span>
        </div>

        <div>
          <h3>Weapon Type</h3>
          <span>{data.weapon}</span>
        </div>

        <div>
          <h3>Quality</h3>
          <span>{data.quality}</span>
        </div>

      </div>
    </>
  )
}

export default EditPreview