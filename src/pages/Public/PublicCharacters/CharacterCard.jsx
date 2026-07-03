import { Link } from "react-router-dom";

function CharacterCard({ character }) {
  console.log("character info", `/character/${encodeURIComponent(character.name)}`)
  return(
    <>
        <Link
          key={character.id}
          to={`/character/${encodeURIComponent(character.name)}`}
          className="char-nav"
        >
          <div>
            <img src={character.icons["FormationRoleCard"]} alt="" />
          </div>
        </Link>
    </>
  )
}

export default CharacterCard