import { BrowserRouter, Routes, Route } from "react-router-dom";
import Characters from "./pages/Characters.jsx";
import Character from "./pages/Character.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Characters />} />
        <Route path="/character/:id" element={<Character />} />
      </Routes>
    </BrowserRouter>
  );
}