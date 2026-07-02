

function CVList({ cv }) {

  console.log(cv)
  return(<>
    <div className="cv-container">
      {
        Object.entries(cv).map(([key, value]) => {
          return(
            <>  
              <div className="flex-end subtext gap">
                <div className="main-color bold">{key}:</div>
                <div>{value}</div>
              </div>
            </>
          )
        })
      }
    </div>
  </>)

}

export default CVList