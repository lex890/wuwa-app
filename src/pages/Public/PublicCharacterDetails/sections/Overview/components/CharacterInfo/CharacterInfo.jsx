import NameRow from "./NameRow"
import TagsRow from "./TagsRow"
import Rarity from "@/components/Rarity"
import Element from "@/components/Element"
import LineSeparator from "@/components/LineSeparator"
import DescriptionRow from "./DescriptionRow"
import InfoRow from "./InfoRow"

function CharacterInfo({data, tags, assets, abilities}) {
  console.log("abilities: ", abilities)
  console.log("tags: ", tags)
  console.log("assets: ", assets)
  console.log("data: ", data)
  return(
    <div className="character-info">
      <div className="name-row first">
        <NameRow name={data.name}/>
        <Element url={assets.element_icon}/>
      </div>
      <div className="name-row second">
        <Rarity star={data.quality_id}/>
      </div>
      <div className="desc-row">
        <DescriptionRow text={tags.description}/>
      </div>
      <div className="tag-row">
        <h2>Tags</h2>
        <TagsRow tags={tags.tags}/>
      </div>
      <LineSeparator />
      <div className="info-row">
        <h2>Info</h2>
        <InfoRow tags={tags}/>
      </div>
    </div>
  )
}

export default CharacterInfo