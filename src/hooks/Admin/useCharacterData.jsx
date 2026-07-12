import { useEffect, useState } from "react";

function useCharacterData(initialCharacters) {
  console.log(initialCharacters)
  const [characters, setCharacters] = useState([]);

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
  const saveCharacters = () => {
    // save characters to local JSON
    // call the db to update table using updated JSON
  }
  const reloadCharacters  = () => {
    // update localState with local JSON
  }

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