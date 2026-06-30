import NameRow from "./NameRow"
import DescRow from "./DescriptionRow"
import TagsRow from "./TagsRow"
import InfoRow from "./InfoRow"
import VoiceRow from "./VoiceRow"

function CharacterInfo({data, tags}) {
  return(
    <div className="character-info">
      <NameRow name={data.name} star={data.quality_id}/>
      <DescRow text={tags.description}/>
      <TagsRow />
      <InfoRow />
      <VoiceRow />
    </div>
  )
}

export default CharacterInfo