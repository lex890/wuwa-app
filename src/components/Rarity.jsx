import Star from "../assets/svg/star.png"

function Rarity({ star = 4 }) {
  return (
    <>
      {Array.from({ length: star }, (_, index) => (
        <img
          key={index}
          src={Star}
          alt="Star"
        />
      ))}
    </>
  );
}

export default Rarity