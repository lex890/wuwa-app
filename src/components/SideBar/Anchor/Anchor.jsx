
import './Anchor.scss'
import { NavLink } from "react-router-dom";

function Anchor({ Image, text, to="/home" }) {
  return(
    <NavLink
      to={`/admin/${to}`}
      className={({ isActive }) =>
        isActive ? "active nav-item" : "nav-item"
      }
    >
      <div className="icon-container">
        <Image />
      </div>
      <span>{text}</span>
    </NavLink>
  )
}

export default Anchor