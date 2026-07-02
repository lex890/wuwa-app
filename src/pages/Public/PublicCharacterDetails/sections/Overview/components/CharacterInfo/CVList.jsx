

function CVList({ cv }) {

  console.log(cv)
  return(<>
    <div className="cv-container">
      {
        Object.entries(cv).map(([key, value]) => {
          return(
            <>  
              <div className="flex-space-between test">
                <div>{key}:</div>
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