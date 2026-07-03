import LevelRow from "./LevelRow"
import StatDisplay from "./StatDisplay"

import { useState } from "react";

function Stats({ stats }) {
   const [level, setLevel] = useState(90);

  return(
    <>
      <div className="section-card">
        <div className="view-card">
          <div className="character-stat">
            <h1>Stats</h1>
            <LevelRow
              level={level}
              setLevel={setLevel}
            />
            <StatDisplay
              stats={stats}
              level={level}
            />
          </div>
        </div>
      </div>
    </>
  ) 
}

export default Stats