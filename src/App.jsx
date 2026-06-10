import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin/Admin.jsx";
import TierList from "./pages/TierList/TierList.jsx";
import TierBuilder from "./pages/TierBuilder/TierBuilder.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/tier-list" element={<TierList />} />
        <Route path="/tier-builder" element={<TierBuilder />} />
        { /* <Route path="/login" element={<Login />} /> */ }
      </Routes>
    </BrowserRouter>
  );
}