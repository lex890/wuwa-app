import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation()

  const words = location.pathname
    .split("/")
    .filter(Boolean)
    .filter(word => word !== "home" && word !== "admin")
    .map(word => decodeURIComponent(word));
  
  return (
    <div className="header-container">
      <span>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "var(--main)",
          }}
        >
          Home
        </Link>

        {words.length > 0 &&
          words.map((word, index) => (
              <span key={index}>
                {" / "}
                {word.charAt(0).toUpperCase() + word.slice(1)}
              </span>
            ))}
      </span>
    </div>
  );
}

export default Header;