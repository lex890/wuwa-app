import { Link } from "react-router-dom";

function Card({ Icon, name, amount, to="" }) {
  return (
    <Link to={to} className="cards">
      <div className="card-icon">
        <Icon />
      </div>

      <div className="card-name">
        <span>{name}</span>
      </div>

      <div className="card-amount">
        <span>{amount}</span>
      </div>
    </Link>
  );
}

export default Card;