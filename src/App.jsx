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

  const [charData, setStateData] = useState([])
  // const [ users, setUsers ] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const cache = getCachedData()

        if (cache !== null){
          setStateData(cache.data)
          console.log("loaded cache")
          return
        }

        const { data, error } = await supabase
          .from("wuwa_characters") // "wuwa_weapons", "wuwa_echoes", etc...
          .select("*");

        if (!error && data.length > 0) {
          setCachedData(data)
          setStateData(data)
        }
      } catch (err) {
        console.error(err)
      }
      })();
  }, []);
  

  return (
    <BrowserRouter>
      <Routes> 
        <Route path="/admin/home" element={<Admin />}>
          <Route index element={<Home data={charData}/>} />
          <Route path="character" element={<Characters data={charData}/>} />
          <Route path="echo" element={<Echoes data={charData}/>} />
          <Route path="weapon" element={<Weapons data={charData}/>} />
        </Route>
        { /* <Route path="/login" element={<Login />} /> */ }
        
        <Route path="/" element={<Navigate to="/admin/home" replace />} />
      </Routes>
      
    </BrowserRouter>
  );
}