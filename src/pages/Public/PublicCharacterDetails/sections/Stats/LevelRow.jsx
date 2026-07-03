import LineSeparator from "@/components/LineSeparator";

function LevelRow({ setLevel, level }) {
  return (
    <div className="box-slider">
      <div className="flex-space-between">
        <span>LEVEL</span>
        <span>{level}</span>
      </div>
      <LineSeparator />
      <div className="slidecontainer">
        <input
          type="range"
          step="10"
          min="10"
          max="90"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default LevelRow