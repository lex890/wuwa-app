import uploadImage from "@/utils/imageParser";

export const useAddCharacterForm = (process) => {
  const getFormData = (form) => {
    const formData = new FormData(form);

    return {
      name: formData.get("name"),
      elementType: formData.get("element_type"),
      weaponType: formData.get("weapon_type"),
      qualityId: Number(formData.get("quality_id")),
      icon: formData.get("icon"),
      rolePortrait: formData.get("rolePortrait"),
      roleHeadIcon: formData.get("roleHeadIcon"),
      formationCard: formData.get("formationCard"),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      elementType,
      weaponType,
      qualityId,
      icon,
      rolePortrait,
      roleHeadIcon,
      formationCard,
    } = getFormData(e.currentTarget);

    const iconPath = await uploadImage(icon, "icons");
    const portraitPath = await uploadImage(rolePortrait, "portraits");
    const headPath = await uploadImage(roleHeadIcon, "heads");
    const formationPath = await uploadImage(formationCard, "formations");

    const newCharacter = {
      name,
      quality_id: qualityId,
      weapon_type: weaponType,
      elemen_type: elementType,
      icon: iconPath,
      icons: {
        FormationRoleCard: formationPath,
        RoleHeadIconBig: headPath,
        RolePortrait: portraitPath,
      },
    };

    await process(newCharacter);
  };

  return {
    handleSubmit,
    getFormData,
  };
};

export default useAddCharacterForm