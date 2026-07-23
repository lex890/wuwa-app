import { useState } from "react"

import SkinHeadIcons from "./SkinHeadIcons"

function Skins({ skinData }) {
  const { skins } = skinData
  const [ select, setSelect ] = useState(skins[0].Id) // stores skin Id

  const handleClick = (e) => {
    const id = e.currentTarget.dataset.id;
    setSelect(Number(id));
    console.log(id);
  }
  console.log(select)
  const i = skins.findIndex(skin => skin.Id === select)
  console.log(i)
  return(
    <>
      <div className="section-card margin-top">
        <div className="view-card character-skins" data-id={skins[i]?.Id}>
          <h1>Skins</h1>
          <div id="skins-image">
            <div>
              <img src={skins[i]?.FormationRoleCard} alt={skins[i]?.Name} />
            </div>
            <SkinHeadIcons skins={skins} id={select} onClick={handleClick}/>
          </div>
          <div>
            <h3>{skins[i]?.Name}</h3>
            <div>{skins[i]?.SubDecName}</div>
            <br />
            <span
              dangerouslySetInnerHTML={{
                __html: skins[i]?.BgDescription
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Skins 