import Rarity from "@/components/Rarity"

function NameRow({ name, star }) {
  return(
    <>
      <div className="name-row">
        <h1>{name}</h1>
        <Rarity star={star}/>
      </div>
    </>
  )
}

export default NameRow