import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "./api/supabase.js"
import { getCachedData, setCachedData } from "./api/local.js"
import Admin from "./pages/Admin/Admin.jsx"
// import process from './api/clean.js'

export default function App() {

  const [charData, setStateData] = useState([])
  // const [ users, setUsers ] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const cache = getCachedData()
        if (cache) {
          console.log('successfuly load data from local storage')
          // const result = process(data)
          setStateData(cache)
          return 
        }
        const { data, error } = await supabase
          .from("wuwa-data")
          .select("payload")
        // modification to supabase query to necessary data only...

        if (error) {
          console.error(error);
          return;
        }
        setStateData(data)
        setCachedData(data)
      } catch (err) {
        console.error("fetchData error:", err);
      }
    })();
  }, []);
  

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/admin_page" 
          element={<Admin data={charData}/>} 
        />
        { /* <Route path="/login" element={<Login />} /> */ }
      </Routes>
    </BrowserRouter>
  );
}