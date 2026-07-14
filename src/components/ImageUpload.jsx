function ImageUpload({ label, name }) {
  return(
    <>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type="file"
        accept="image/*"
      />
    </>
  )
}

export default ImageUpload