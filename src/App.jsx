import React, { Suspense, lazy } from "react";
import { useState, useEffect } from "react";
import "./App.css";
import Navbar1 from "./components/Navbar1";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
// import IncidentReportForm from "./pages/IncidentReportForm";
// import UserDashboard from "./pages/UserDashboard"; //lazy loaded
// import AdminDashboard from "./pages/AdminDashboard"; //lazy loaded
// import AboutUs from "./pages/AboutUs"; //lazy loaded

// import HeatMap from "./components/Heatmap"; //static heatmap
// import HeatMap2 from "./components/Heatmap2"; //testing heatmap-now final
// import HeatMap3 from "./components/Heatmap3"; //not in use
import VoiceToText from "./components/VoiceToText";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
// import Blogs from "./pages/Blog"; not in use anymore
import ScrollToTop from "./lib/ScrollToTop";
import { AuthProvider, useAuth } from "./context/AuthContext";
// import RecentIncidents from "./pages/RecentIncidents";
// import FeedbackForm from "./pages/FeedbackForm";
import ViewDetails from "./pages/ViewDetails";
// import Chatbot from "./pages/chatbotTrial";
import UserRoute from "./protected-routes/UserRoute";
import AdminRoute from "./protected-routes/AdminRoute";
import IncidentChart from "./pages/chart";
import UserProfile from "./pages/UserProfile";

const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const RecentIncidents = lazy(() => import("./pages/RecentIncidents"));
const HeatMap2 = lazy(() => import("./components/Heatmap2"));
const IncidentReportForm = lazy(() => import("./pages/IncidentReportForm2"));
const FeedbackForm = lazy(() => import("./pages/FeedbackForm"));
const Chatbot = lazy(() => import("./pages/chatbotTrial"));

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
          <Suspense fallback={<div>Loading...</div>}>
            <ScrollToTop />
            <Navbar1 />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/report-incident" element={<IncidentReportForm />} />
              {/* Protected Admin Route */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
              {/* Protected User Route */}
              <Route element={<UserRoute />}>
                <Route path="/my-reports" element={<UserDashboard />} />
              </Route>
              <Route path="/my-reports" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/About" element={<AboutUs />} />
              <Route path="/heatmap" element={<HeatMap2 />} />
              <Route path="/voice-report" element={<VoiceToText />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/InciLog" element={<RecentIncidents />} />
              <Route path="/view-details/:id" element={<ViewDetails />} />
              <Route path="/feedback" element={<FeedbackForm />} />
              <Route path="chatbot" element={<Chatbot />} />
              <Route path="/charts" element={<IncidentChart />} />
              <Route path="/incident/:id" element={<ViewDetails />} />
              <Route path="/user/:userId" element={<UserProfile />} />
              {/* Redirect all unknown routes to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
};

export default App;
