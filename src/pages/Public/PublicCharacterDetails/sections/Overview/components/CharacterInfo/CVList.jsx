

function CVList({ cv }) {
  
    
  return(
    <>
      <div className="tags">
        {
          cv.map((va) => {
            return <Tags info={tag}/>
          })
        }
      </div>
    </>
  )
}

export default CVList