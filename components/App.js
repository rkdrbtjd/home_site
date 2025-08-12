import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/mainpage";
import LodgingPage from "./components/LodgingPage";
import SearchPage from "./components/SearchPage";
import TransferPage from "./components/TransferPage"; // ★ 추가
import UploadPage from "./components/UploadPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/lodging" element={<LodgingPage />} />
        <Route path="/transfer" element={<TransferPage />} /> 
        <Route path="/search" element={<SearchPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;