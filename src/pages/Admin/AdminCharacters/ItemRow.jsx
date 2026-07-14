import OptionsButton from './OptionsButton'

import defaultImage from '../../../assets/webp/default_image.webp'

function ItemRow({ item, openModal }) {
  return(
    <li key={item.id} className="character-list">
      <div className='list-wrapper'>
        <div className="char-icon">
          <img 
            src={item.icons?.RoleHeadIconBig ?? defaultImage} 
            alt={item?.name ?? "Character icon"} 
          />
        </div>
        <span>{item.id}</span>
        <span>{item.name}</span>
        <span>{item.elemen_type}</span>
        <span>{item.weapon_type}</span>
        <div className="options">
          <OptionsButton 
            open={() => openModal("edit", item)}
          />
        </div>

      </div>
    </li>
  )
}

export default ItemRow