import { useContext } from "react";
import { EchoFilterContext } from "@/pages/Public/PublicEchoes/EchoFilterProvider";

export function useEcho() {
  const context = useContext(EchoFilterContext);

  if (!context) {
    throw new Error(
      "useEchoFilters must be used within EchoFilterProvider"
    );
  }

  return context;
}