import { Link } from "react-router-dom";

function CharacterCard({ character }) {

  return(
    <>
    <div className="card">
        <Link
          key={character.id}
          to={`/character/${encodeURIComponent(character.name)}`}
          className="char-nav"
        >
          <div>
            <img src={character.icons["FormationRoleCard"]} alt="" />
          </div>
        </Link>
    </div>

    </>
  )
}

export default CharacterCard