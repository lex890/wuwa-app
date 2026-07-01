
import CVList from "./CVList"

function InfoRow({ tags }) {
  
  const { affiliation, birthday, gender, cv } = tags

  console.log("tags: ", affiliation, birthday, gender, cv )
  
  return(
    <>
      <div className="info-entry">
        <div className="flex-space-between">
          <div>Birthday:</div>
          <div>{birthday}</div>
        </div>
        <div className="flex-space-between">
          <div>Gender:</div>
          <div>{gender}</div>
        </div>
        <div className="flex-space-between">
          <div>Affiliation:</div>
          <div>{affiliation}</div>
        </div>
        <div className="flex-space-between">
          <span>CV:</span>
          <CVList cv={cv}/>
        </div>
      </div>
    </>
  )
}

export default InfoRow