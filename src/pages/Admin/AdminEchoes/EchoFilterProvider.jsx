import { createContext } from "react";
import useEchoController from "@/hooks/Admin/useEchoController";

export const EchoFilterContext = createContext(null);

export function EchoFilterProvider({ children, data }) {
  const filters = useEchoController(data)
  
  return(
    <EchoFilterContext.Provider value={filters}>
      {children}
    </EchoFilterContext.Provider>
  )
}
