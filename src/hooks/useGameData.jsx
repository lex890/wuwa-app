import { useEffect, useState, useCallback } from "react";
import readData from "@/api/read";

export function useGameData() {
  const [characters, setCharacters] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [echoes, setEchoes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const data = await readData(forceRefresh);

      setCharacters(data.characters);
      setWeapons(data.weapons);
      setEchoes(data.echoes);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("hasOpenedBefore")) {
      localStorage.clear();
      localStorage.setItem("hasOpenedBefore", "true");
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  return {
    characters,
    weapons,
    echoes,
    loading,
    error,
    loadData,
  };
}