

function SkinHeadIcons({ id, skins, onClick }) {
  return(
    <div className="role-head-container">
      {
        skins.map(skin=>{
          return(
            <>
              <div 
                className={id === skin.Id ? "active" : ""}
                data-id={skin.Id}
                onClick={onClick}
              >
                <img src={skin.RoleHeadIconLarge} alt="" />
              </div>
            </>
          )
        })
      }
    </div>
  )
}

export default SkinHeadIcons