import { useState, useEffect } from "react";
import getCharData from "@/api/getCharData";

function useCharacterData(characterName) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const decCharName = decodeURIComponent(characterName);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const cache = JSON.parse(localStorage.getItem("wuwa-data"));
        console.log("Cache:", cache);
        const character = cache.data.characters.find(
          entry => entry.name === decCharName
        );
        console.log("Found:", character);
        if (!character) {
          throw new Error("Character not found");
        }
        // retrieve extra assets from db
        const extra = await getCharData(decCharName);
        console.log("Extra stuff: ", extra);
        if (!cancelled) {
          setData({
            character,
            ...extra,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [decCharName]);

  return { data, loading, error };
}

export default useCharacterData;