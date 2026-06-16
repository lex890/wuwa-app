import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getWuwaData } from "./api/read.js"

import Admin from "./pages/Admin/Admin.jsx"
import Home from "./pages/Admin/AdminHome/Home.jsx"
import Characters from "./pages/Admin/AdminCharacters/Characters.jsx"
import Weapons from "./pages/Admin/AdminWeapons/Weapons.jsx"
import Echoes from "./pages/Admin/AdminEchoes/Echoes.jsx"


export default function App() {

  const [characters, setCharacters] = useState([])
  const [weapons, setWeapons] = useState([])
  const [echoes, setEchoes] = useState([])
  
  useEffect(() => {
    (async () => {
      const { characters, weapons, echoes } = await getWuwaData();

      setCharacters(characters);
      setWeapons(weapons);
      setEchoes(echoes);
    })();
  }, []);
  
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<Admin />}>
          <Route index element={<Home data={{ characters, weapons, echoes }} />} />

          <Route path="character" element={<Characters data={characters} />} />
          <Route path="echo" element={<Echoes data={echoes} />} />
          <Route path="weapon" element={<Weapons data={weapons} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}