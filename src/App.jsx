import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "./routes/AppRoutes";
import './App.scss'

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
