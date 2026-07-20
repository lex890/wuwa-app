import { useContext } from "react";
import { EchoFilterContext } from "@/pages/Admin/AdminEchoes/EchoFilterProvider";

export function useEcho() {
  const context = useContext(EchoFilterContext);

  if (!context) {
    throw new Error(
      "useEchoFilters must be used within EchoFilterProvider"
    );
  }

  return context;
}