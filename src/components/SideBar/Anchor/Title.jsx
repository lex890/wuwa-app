import StarIcon from '../../../assets/svg/star.png'
import { NavLink } from "react-router-dom";

function Title({ to = "/", cName = "title" }) {
  return(
    <NavLink to={to} className={cName}>
      <img src={StarIcon} alt="" />
      <span>Sonoro</span>
    </NavLink>
  )
}

export default Title