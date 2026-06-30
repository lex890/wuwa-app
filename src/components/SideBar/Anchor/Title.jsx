import AnimatedLogo from '../../AnimatedLogo/AnimatedLogo.jsx'
import { NavLink } from "react-router-dom";

function Title({ to = "/", cName = "title" }) {
  return(
    <NavLink to={to} className={cName}>
      <AnimatedLogo className="sonoro-logo" />
      <span>Sonoro</span>
    </NavLink>
  )
}

export default Title
