import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/appRoutes";

import './App.scss'

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
