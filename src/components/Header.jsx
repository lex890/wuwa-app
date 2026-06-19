import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  const words = location.pathname
    .split("/")
    .filter(Boolean);

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="header-container">
      <span>{capitalize(words[0])}</span>

      {words.slice(1).map((word, index) => {
        const path = "/" + words.slice(0, index + 2).join("/");

        return (
          <span key={path}>
            {" / "}
            <Link to={path}>
              {word.charAt(0).toUpperCase() + word.slice(1)}
            </Link>
          </span>
        );
      })}
    </div>
  );
}

export default Header;