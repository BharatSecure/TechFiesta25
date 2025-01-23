import Navbar1 from "./components/Navbar1";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import IncidentReportForm from "./pages/IncidentReportForm";
import UserDashboard from "./pages/UserDashboard";
import { IncidentsProvider } from "./context/IncidentsContext";
import AdminDashboard from "./pages/AdminDashboard";
import AboutUs from "../src/pages/AboutUs";

import HeatMap from "./components/Heatmap";
import VoiceToText from "./components/VoiceToText";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Blogs from "./pages/Blog";
import ScrollToTop from "./lib/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <IncidentsProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Navbar1 />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/report-incident" element={<IncidentReportForm />} />
              <Route path="/my-reports" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/heatmap" element={<HeatMap />} />
              <Route path="/voice-report" element={<VoiceToText />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/blogs" element={<Blogs />} />
            </Routes>
          </BrowserRouter>
        </IncidentsProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
