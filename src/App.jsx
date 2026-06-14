import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "./api/supabase.js"
import { getCachedData, setCachedData } from "./api/local.js"
import Admin from "./pages/Admin/Admin.jsx"
import Home from "./pages/Admin/Home/Home.jsx"

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
          .from("wuwa_characters")
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
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Home data={charData}/>} />
        </Route>
        { /* <Route path="/login" element={<Login />} /> */ }
      </Routes>
    </BrowserRouter>
  );
}