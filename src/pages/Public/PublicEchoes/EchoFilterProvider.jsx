import { createContext } from "react";

import useEchoFilter from "@/hooks/Public/useEchoFilter";

export const EchoFilterContext = createContext(null);

export function EchoFilterProvider({ children, data }) {
  const filters = useEchoFilter(data)
  console.log(filters)
  return(
    <EchoFilterContext.Provider value={filters}>
      {children}
    </EchoFilterContext.Provider>
  )
}
