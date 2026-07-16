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
    if (!character) {
      return {
        message: "Something went wrong.",
        type: "error",
      }
    }
    setCharacters(prev => [...prev, character])
    return {
      message: "New Character added",
      type: "success",
    }
  }
  const removeCharacter = (character) => {
    setCharacters(prev => 
      prev.filter(char => char.id !== character.id)
    );
  };
  const updateCharacter  = (character) => {
    if (!character) {
      return {
        message: "No changes detected.",
        type: "neutral",
      }
    }
    setCharacters(prev =>
      prev.map(char =>
        char.id === character.id ? character : char
      )
    );
    return {
      message: `${character.id} has been updated.`,
      type: "success",
    }
  };
  const saveCharacters = async () => {
    const newData = characters.filter(char => !char.id);
    if (newData.length === 0) {
      return {
        message: "No changes detected.",
        type: "neutral",
      }
    }
    const confirmed = confirm(
      `Save ${newData.length} new character(s)?`
    );
    if (!confirmed) {
      return {
        message: "Save cancelled.",
        type: "neutral",
      };
    }

    const { error } = await addRow("wuwa_characters", newData)
    if (error) { 
      return {
        message: "Adding failed.",
        type: "error",
      }
    }
    localStorage.clear();
    await loadData();
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