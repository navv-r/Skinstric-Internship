import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TestingPage from "./pages/TestingPage";
import ResultPage from "./pages/ResultPage";
import CameraPage from "./pages/CameraPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/testing" element={<TestingPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/camera" element={<CameraPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;