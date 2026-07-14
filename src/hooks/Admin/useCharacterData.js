import { useEffect, useState } from "react";
import { addRow } from "@/api";

function useCharacterData(initialCharacters, loadData) {
  const [characters, setCharacters] = useState([]);
  console.log("loadData:", loadData);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCharacters(initialCharacters ?? []);
  }, [initialCharacters]);

  const addCharacter = (character) => {
    setCharacters(prev => [...prev, character])
  }
  const removeCharacter = (character) => {
    setCharacters(prev => 
      prev.filter(char => char.id !== character.id)
    );
  };
  const updateCharacter  = (character) => {
    setCharacters(prev =>
      prev.map(char =>
        char.id === character.id ? character : char
      )
    );
  };
  const saveCharacters = async () => {
    const newData = characters.filter(char => !char.id);
    if (newData.length === 0) {
      return {
        message: "No changes detected.",
        type: "neutral",
      }
    }
    const { data, error } = await addRow("wuwa_characters", newData)
    if (error) { 
      return {
        message: "Adding failed.",
        type: "error",
      }
    }
    // instead of adding the row with id in state, perform a force fetching
    addCharacter(data)
    return {
      message: "Character(s) saved.",
      type: "success"
    }
  }

  const reloadCharacters = async () => {
    localStorage.clear();

    await loadData();

    return {
      message: "Characters reloaded.",
      type: "success",
    };
  };

  return{
    characters: characters,
    actions: {
      add: addCharacter,
      remove: removeCharacter,
      update: updateCharacter,
      save: saveCharacters,
      reload: reloadCharacters,
    }
  }

}

export default useCharacterData