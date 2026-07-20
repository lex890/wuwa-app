import { useMemo } from "react";
import { echoSets } from "@/constant/echoSets";

const echoSetMap = Object.fromEntries(
  echoSets.map((set) => [set.name, set])
);

function useEchoType(sets, data) {
  return useMemo(() => {
    const groups = {};
    const hasFilter = sets.length > 0;

    data.forEach((echo) => {
      echo.sets.forEach((set) => {
        if (hasFilter && !sets.includes(set.Name)) return;

        const setEcho = echoSetMap[set.Name];

        if (!setEcho) return;

        if (!groups[set.Name]) {
          groups[set.Name] = {
            ...setEcho,
            echoes: [],
          };
        }

        groups[set.Name].echoes.push(echo);
      });
    });

    return Object.values(groups);
  }, [data, sets]);
}

export default useEchoType