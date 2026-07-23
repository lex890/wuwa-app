import LineSeparator from "@/components/LineSeparator";

function LevelRow({ setLevel, level, min = 10, max = 90, name="LEVEL" }) {
  return (
    <div className="box-slider">
      <div className="flex-space-between">
        <span>{name}</span>
        <span>{level}</span>
      </div>
      <LineSeparator />
      <div className="slidecontainer">
        <input
          type="range"
          step={min}
          min={min}
          max={max}
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default LevelRow