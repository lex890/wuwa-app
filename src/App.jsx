import { BrowserRouter } from "react-router-dom"
import { useGameData } from "./hooks/useGameData"
import AppRoutes from "./routes/appRoutes";

export default function App() {
  const gameData = useGameData();

  // if (gameData.loading) return <Loading />; no loading component yet
  if (gameData.error) return <Error />;

  return (
    <BrowserRouter>
      <AppRoutes {...gameData} />
    </BrowserRouter>
  );
}
