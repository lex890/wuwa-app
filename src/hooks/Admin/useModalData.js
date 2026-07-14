import defaultImage from '../../assets/webp/default_image.webp'

function useModalData(data) {
  const { 
    id, 
    name, 
    quality_id: quality,
    elemen_type: element, 
    weapon_type: weapon,
    created_at: date,
    icons
  } = data ?? {}
  const {
    RoleHeadIconBig: head = defaultImage,
    RolePortrait: full = defaultImage,
    FormationRoleCard: torso = defaultImage,
  } = icons ?? {};

  return { 
    meta: {
      id,
      name,
      date,
      weapon,
      quality,
      element, 
    },
    assets: {
      head,
      full,
      torso
    }
  }
}

export default useModalData