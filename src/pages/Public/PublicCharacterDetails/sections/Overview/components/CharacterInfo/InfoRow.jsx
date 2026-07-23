
import CVList from "./CVList"
import { removeSTags } from "@/utils/textParser"

function InfoRow({ tags }) {
  const { affiliation, birthday, gender, cv } = tags

  return(
    <>
      <div className="info-entry">
        <div className="flex-space-between subtext">
          <div>Birthday:</div>
          <div>{birthday}</div>
        </div>
        <div className="flex-space-between subtext">
          <div>Gender:</div>
          <div>{gender}</div>
        </div>
        <div className="flex-space-between subtext">
          <div>Affiliation:</div>
          <div>{removeSTags(affiliation)}</div>
        </div>
        <div className="flex-space-between subtext">
          <span>CV:</span>
          <CVList cv={cv}/>
        </div>
      </div>
    </>
  )
}

export default InfoRow