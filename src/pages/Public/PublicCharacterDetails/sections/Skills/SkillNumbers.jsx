import LevelRow from "../Stats/LevelRow"
import SkillDisplay from "./SkillDisplay";
import { useState } from "react";

function SkillNumbers({ attributes }) {
  const [level, setLevel] = useState(1);
  return(
    <>
      <div className="skill-numbers flex-start">
        <div className="full-width">
          {attributes?.length > 0 && (
            <>
              <LevelRow
                level={level}
                setLevel={setLevel}
                min={1}
                max={10}
                name="SKILL LEVEL"
              />
              <SkillDisplay
                stats={attributes}
                level={level}
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default SkillNumbers