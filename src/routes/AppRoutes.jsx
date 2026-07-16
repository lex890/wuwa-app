import ErrorPage from "../assets/components/ErrorPage"
import { Routes, Route, Navigate } from "react-router-dom"

import {
  AdminHome,
  Characters,
  Weapons,
  Echoes,
} from "../pages/Admin";

import {
  HeroPage,
  CharacterList,
  WeaponList,
  CharacterDetails,
  EchoList,
  TierList,
  TierBuilder,
  UserAccess,
  Profile,
} from "../pages/Public";

import {
  AdminLayout,
  AuthLayout,
  MainLayout
} from "../layout/"

export default function AppRoutes({
  characters,
  weapons,
  echoes,
  loadData,
}) {
  return (
  <Routes>
    {/* AuthLayout */}
    <Route element={<AuthLayout />}>
      <Route path="user-access" element={<Navigate to="/login" replace />} />
      
      <Route path="login" element={<UserAccess />} />
      <Route path="signup" element={<UserAccess />} />
      <Route path="forgot-pass" element={<UserAccess />} />
      <Route path="verify-email" element={<UserAccess />} />
      <Route path="reset-password" element={<UserAccess />} />
      <Route path="profile" element={<Profile />} />

      <Route path="*" element={<ErrorPage />} />
    </Route>

    {/* Public */}
    <Route element={<MainLayout />}>
      <Route index element={ <Navigate to="home" replace />} />
      
      <Route path="home" element={<HeroPage />}/> 
      <Route path="character" element={<CharacterList data={characters}/>}/>
      <Route path="character/:characterName" element={<CharacterDetails />}/>
      <Route path="weapons" element={<WeaponList />} />
      <Route path="echoes" element={<EchoList />} />
      <Route path="tier-list" element={<TierList data={{ characters, weapons, echoes }}/>} />
      <Route path="tier-builder" element={<TierBuilder data={{ characters, weapons, echoes }}/>} />
      {/* Public 404 */}
      <Route path="*" element={<ErrorPage />} />
    </Route>

    {/* Admin */}
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="home" replace />} />

      <Route path="home" element={ <AdminHome data={{ characters, weapons, echoes }} />}/>
      <Route path="character" element={<Characters data={characters} loadData={loadData}/>}/>
      <Route path="weapon" element={<Weapons data={weapons} />}/>
      <Route path="echo" element={<Echoes data={echoes} />}/>

      {/* Public 404 */}
      <Route path="*" element={<ErrorPage />} />
    </Route>
  </Routes>
  );
}