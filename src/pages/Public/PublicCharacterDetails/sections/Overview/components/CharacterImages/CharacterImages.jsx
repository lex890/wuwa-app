import Carousel from "./Carousel"

function CharacterImages({ data }) {
  
  const {
    // RoleHeadIconBig,
    FormationRoleCard,
    // RolePortrait,
  } = data.icons ?? {}

  const images = [
    // RoleHeadIconBig,
    FormationRoleCard,
    // RolePortrait,
  ].filter(Boolean) // removes undefined/null
  
  return(
    <div className="character-images">
      {/* */}
      <Carousel images={images} /> 
    </div>
  )
}

export default CharacterImages