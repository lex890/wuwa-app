import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./api/supabase.js";
import Admin from "./pages/Admin/Admin.jsx"
// import process from './api/clean.js'

export default function App() {

  const [charData, setCharData] = useState([])
  // const [ users, setUsers ] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("wuwa-data")
        .select(`payload`);

      if (error) {
        console.error(error)
        return
      }
      console.log(data)
      // const result = process(data) 
      setCharData(data) // result
    }

    fetchData();
  }, [])
  

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