function EditForm({ handleSubmit }) {
  return(
    <>
      <form id="editForm" onSubmit={handleSubmit}>
        <label htmlFor=""></label>
        <input type="text" />
      </form>
      <div>
        <button>Save</button>
        <button>Edit</button>
      </div>
    </>
  )
}

export default EditForm