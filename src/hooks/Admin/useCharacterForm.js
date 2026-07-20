function useCharacterForm(saveCharacter, initialCharacter = {}) {
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    const character = {
      ...initialCharacter,
      name: formValues.name ?? initialCharacter.name,
      elemen_type:
        formValues.elemen_type ??
        formValues.element_type ??
        formValues.element ??
        initialCharacter.elemen_type,
      weapon_type:
        formValues.weapon_type ??
        formValues.weapon ??
        initialCharacter.weapon_type,
      quality_id: Number(
        formValues.quality_id ??
        formValues.quality ??
        initialCharacter.quality_id
      ),
    };

    saveCharacter(character);
  };

  return { handleSubmit };
}

export default useCharacterForm;
