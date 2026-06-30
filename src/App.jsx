import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import readTable from "./api/read"

import ErrorPage from "./assets/components/ErrorPage"

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
import TierList from "./pages/Public/PublicTierlist/Tierlist.jsx"
import TierBuilder from "./pages/Public/TierListBuilder/TeamTierList.jsx"
import UserAccess from "./pages/Public/UserAccess/UserAccess.jsx"
import Profile from "./pages/Public/UserAccess/Profile.jsx"

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
    if (!localStorage.getItem('hasOpenedBefore')) {
      localStorage.clear()
      localStorage.setItem('hasOpenedBefore', 'true')
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData()
  }, [])
    console.log(characters)

  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={ <Navigate to="home" replace />} />
          
          <Route // /home 
            path="home"
            element={
              <HeroPage />
            }/> 
          <Route path="character" element={
            <CharacterList 
              data={characters}
            />} 
          />
          <Route path="character/:characterName" element={<CharacterDetails />} />
          <Route path="weapons" element={<WeaponList />} />
          <Route path="echoes" element={<EchoList />} />

          <Route path="tier-list" element={<TierList data={{ characters, weapons, echoes }}/>} />
          <Route path="tier-builder" element={<TierBuilder data={{ characters, weapons, echoes }}/>} />
          <Route path="user-access" element={<Navigate to="/login" replace />} />
          <Route path="login" element={<UserAccess />} />
          <Route path="signup" element={<UserAccess />} />
          <Route path="forgot-pass" element={<UserAccess />} />
          <Route path="verify-email" element={<UserAccess />} />
          <Route path="profile" element={<Profile />} />

          {/* Public 404 */}
          <Route path="*" element={<ErrorPage />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="home" replace />} />

          <Route // admin/home
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

          {/* Public 404 */}
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
