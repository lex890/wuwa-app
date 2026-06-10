import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Admin from "./pages/Admin/Admin.jsx"
import { supabase } from "./api/supabase.js";


export default function App() {

  const [data, setData] = useState([])

  async function fetchData() {
    const { data } = supabase
      .from()
      .select()
    setData(data)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Admin />} />
        { /* <Route path="/login" element={<Login />} /> */ }
      </Routes>
    </BrowserRouter>
  );
}