import { createContext } from "react";
import useEchoController from "@/hooks/Admin/useEchoController";

export const EchoFilterContext = createContext(null);

export function EchoFilterProvider({ children, data, loadData }) {
  const echoController = useEchoController(data, loadData)
  console.log(echoController)
  return(
    <EchoFilterContext.Provider value={echoController}>
      {children}
    </EchoFilterContext.Provider>
  )
}
