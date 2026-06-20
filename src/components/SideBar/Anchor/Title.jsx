import ReactIcon from '../../../assets/svg/react.svg'
import { NavLink } from "react-router-dom";

function Title({ to = "/", cName = "title" }) {
  return(
    <NavLink to={to} className={cName}>
      <img src={ReactIcon} alt="" />
      <span>Sonoro</span>
    </NavLink>
  )
}

export default Title