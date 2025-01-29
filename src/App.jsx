// import React, { Suspense, lazy } from "react";
import "./App.css";
import Navbar1 from "./components/Navbar1";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import IncidentReportForm from "./pages/IncidentReportForm";
import UserDashboard from "./pages/UserDashboard";//lazy loaded
// const UserDashboard = lazy(() => import("./pages/UserDashboard"));
import AdminDashboard from "./pages/AdminDashboard"; //lazy loaded
// const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
import AboutUs from "./pages/AboutUs";
// const AboutUs = lazy(() => import("./pages/AboutUs"));

// import HeatMap from "./components/Heatmap"; //static heatmap
// import HeatMap2 from "./components/Heatmap2"; //testing heatmap
import HeatMap3 from "./components/Heatmap3"; //heatmap to be conncted to backend
import VoiceToText from "./components/VoiceToText";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
// import Blogs from "./pages/Blog"; not in use anymore  //lazy loaded
import ScrollToTop from "./lib/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import RecentIncidents from "./pages/RecentIncidents";
// const RecentIncidents = lazy(() => import("./pages/RecentIncidents"));
import FeedbackForm from "./pages/FeedbackForm";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

const App = () => {
  return (
    <AuthProvider>
      <div>
        <BrowserRouter>
          <ScrollToTop />
          <Navbar1 />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report-incident" element={<IncidentReportForm />} />
            <Route path="/my-reports" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/heatmap" element={<HeatMap3 />} />
            <Route path="/voice-report" element={<VoiceToText />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blogs" element={<RecentIncidents />} />
            <Route path="/feedback" element={<FeedbackForm />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
};

export default App;
