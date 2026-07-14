import { useState, useMemo } from "react";

function useSearch(characters) {
  const [searchTerm, setSearchTerm] = useState("")

  const filterChar = useMemo(() => {
    return characters.filter(char => {
      const search = searchTerm.toLowerCase();
      const searchNumber = Number(searchTerm);

      return (
        (!isNaN(searchNumber) && char.id === searchNumber) ||
        char.name?.toLowerCase().includes(search) ||
        char.weapon_type?.toLowerCase().includes(search) ||
        char.elemen_type?.toLowerCase().includes(search)
      );
    });
  }, [characters, searchTerm]);

  return { searchTerm, setSearchTerm, filterChar }
}

export default useSearch
