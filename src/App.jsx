import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import readTable from "./api/read"

import Admin from "./pages/Admin/Admin.jsx"
import Home from "./pages/Admin/AdminHome/Home.jsx"
import Characters from "./pages/Admin/AdminCharacters/Characters.jsx"
import Weapons from "./pages/Admin/AdminWeapons/Weapons.jsx"
import Echoes from "./pages/Admin/AdminEchoes/Echoes.jsx"
import TierList from "./pages/TierList/TierList.jsx"
import TierBuilder from "./pages/TierBuilder/TierBuilder.jsx"

export default function App() {
  const [characters, setCharacters] = useState([])
  const [weapons, setWeapons] = useState([])
  const [echoes, setEchoes] = useState([])

  const loadData = async (forceRefresh = false) => {
    const { characters, weapons, echoes } = await readTable(forceRefresh)
    setCharacters(characters)
    setWeapons(weapons)
    setEchoes(echoes)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<Admin />}>
          <Route index element={<Home data={{ characters, weapons, echoes }} />} />
          <Route path="character" element={<Characters data={characters} reload={(truth) => loadData(truth)} />} />
          <Route path="echo" element={<Echoes data={echoes} />} />
          <Route path="weapon" element={<Weapons data={weapons} />} />
        </Route>

        <Route path="/tier-list" element={<TierList data={characters} />} />
        <Route path="/tier-builder" element={<TierBuilder data={characters} />} />
      </Routes>
    </BrowserRouter>
  )
}