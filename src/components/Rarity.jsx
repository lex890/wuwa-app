import Star from "../assets/svg/star.png"

function Rarity({ star = 4 }) {
  return (
    <>
      <div className="rarity-container">
        {Array.from({ length: star }, (_, index) => (
          <img
            key={index}
            src={Star}
            alt="Star"
          />
        ))}
      </div>
    </>
  );
}

export default Rarity