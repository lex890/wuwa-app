function Element({ url, type = "primary" }) {
  return(
    <>
      <div className="element-icon">
        {type === "primary" ? 
          <img src={url.primary}/> : 
          <img src={url.secondary}/> 
        }
      </div>
    </>
  )
}

export default Element