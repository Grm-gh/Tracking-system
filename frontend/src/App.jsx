import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Join from "./pages/Join";
import MapPage from "./pages/MapPage";

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}
