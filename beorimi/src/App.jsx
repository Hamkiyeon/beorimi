import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Camera from "./pages/Camera";
import Disposal from "./pages/Disposal";
import Guide from "./pages/Guide";
import Result from "./pages/Result";
import Header from "./components/Header";
import Menu from "./components/Menu";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <Header setMenuOpen={setMenuOpen} />
      <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/disposal" element={<Disposal />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}