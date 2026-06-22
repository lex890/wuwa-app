import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import readTable from "./api/read"

// admin components
import AdminLayout from "./pages/Admin/Admin.jsx"
import AdminHome from "./pages/Admin/AdminHome/Home.jsx"
import Characters from "./pages/Admin/AdminCharacters/Characters.jsx"
import Weapons from "./pages/Admin/AdminWeapons/Weapons.jsx"
import Echoes from "./pages/Admin/AdminEchoes/Echoes.jsx"

// public components
import PublicLayout from "./pages/Public/Public.jsx"
import HeroPage from "./pages/Public/PublicHome/Hero.jsx"
import CharacterList from "./pages/Public/PublicCharacters/Characters.jsx"
import WeaponList from "./pages/Public/PublicWeapons/Weapons.jsx"
import CharacterDetails from "./pages/Public/PublicCharacterDetails/CharacterDetails.jsx"
import EchoList from "./pages/Public/PublicEchoes/Echoes.jsx"

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData()
  }, [])
    console.log(characters)

  
  return (
    <BrowserRouter>
      <Routes>
      {/* Public */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HeroPage />} />

        <Route path="characters" element={<CharacterList />} />
        <Route path="characters/:id" element={<CharacterDetails />} />

        <Route path="weapons" element={<WeaponList />} />
        <Route path="echoes" element={<EchoList />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="home" replace />} />

        <Route
          path="home"
          element={
            <AdminHome
              data={{ characters, weapons, echoes }}
            />
          }
        />

        <Route
          path="character"
          element={
            <Characters
              data={characters}
              reload={loadData}
            />
          }
        />

        <Route path="weapon" element={
          <Weapons data={weapons} />} />
        <Route path="echo" element={
          <Echoes data={echoes} />} />
      </Route>
      </Routes>
    </BrowserRouter>
  );
}