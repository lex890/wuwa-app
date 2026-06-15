import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "./api/supabase.js"
import { getCachedData, setCachedData } from "./api/local.js"
import Admin from "./pages/Admin/Admin.jsx"
import Home from "./pages/Admin/Home/Home.jsx"
import Characters from "./pages/Admin/Characters/Characters.jsx"
import Weapons from "./pages/Admin/Weapons/Weapons.jsx"
import Echoes from "./pages/Admin/Echoes/Echoes.jsx"

export default function App() {

  const [characters, setCharacters] = useState([])
  const [weapons, setWeapons] = useState([])
  const [echoes, setEchoes] = useState([])
  
  useEffect(() => {
    (async () => {
      try {
        const local_char = getCachedData("wuwa-character")
        const local_weapon = getCachedData("wuwa-weapon")
        const local_echo = getCachedData("wuwa-echo")

        if (local_char !== null && 
            local_weapon !== null && 
            local_echo !== null) {
          setCharacters(local_char.data)
          setWeapons(local_weapon.data)
          setEchoes(local_echo.data)
          
          return
        }

        const [
          { data: s_char, error: c_error },
          { data: s_weap, error: w_error },
          { data: s_echo, error: e_error }
        ] = await Promise.all([
          supabase.from("wuwa_characters").select("*"),
          supabase.from("wuwa_weapons").select("*"),
          supabase.from("wuwa_echoes").select("*")
        ]);

        if (!c_error && s_char?.length > 0) {
          setCachedData(s_char, "wuwa-character")
          setCharacters(s_char)
        }

        if (!w_error && s_weap?.length > 0) {
          setCachedData(s_weap, "wuwa-weapon")
          setWeapons(s_weap)
        }

        if (!e_error && s_echo?.length > 0) {
          setCachedData(s_echo, "wuwa-echo")
          setEchoes(s_echo)
        }
      } catch (err) {
        console.error(err)
      }
      })();
  }, []);
  
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate to="home" replace />} />

          <Route path="home" element={<Home data={{ characters, weapons, echoes }} />} />
          <Route path="character" element={<Characters data={characters} />} />
          <Route path="echo" element={<Echoes data={echoes} />} />
          <Route path="weapon" element={<Weapons data={weapons} />} />
        </Route>

        <Route path="/" element={<Navigate to="/admin/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}