import { BrowserRouter } from "react-router-dom"
import { useGameData } from "./hooks/Public/useGameData"
import AppRoutes from "./routes/appRoutes";

import './App.scss'

export default function App() {
  const gameData = useGameData();
  if (gameData.error) return <Error />;
  console.log(gameData)
  return (
    <BrowserRouter>
      <AppRoutes {...gameData} />
    </BrowserRouter>
  );
}
