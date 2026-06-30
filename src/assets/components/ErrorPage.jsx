import { Link } from "react-router";
import Camellya from "../webp/Camellya.webp"

const ErrorPage = () => {
  return (
    <>
      <div>
        <h1>Oh no, this route doesn't exist!</h1>
        <Link to="/">
          You can go back to the home page by clicking here, though!
        </Link>
      </div>
      <img src={Camellya} alt="" />
    </>
  );
};

export default ErrorPage;
