import Navbar1 from "./components/Navbar1";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import IncidentReportForm from "./pages/IncidentReportForm";
<<<<<<< Updated upstream
import UserDashboard from "./pages/UserDashboard";
import { IncidentsProvider } from "./context/IncidentsContext";
import AdminDashboard from "./pages/AdminDashboard";
import AboutUs from "../src/pages/AboutUs";
=======
import UserDashboard from "./pages/UserDashboard"; //lazy loaded
// const UserDashboard = lazy(() => import("./pages/UserDashboard"));
import AdminDashboard from "./pages/AdminDashboard"; //lazy loaded
// const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
import AboutUs from "./pages/AboutUs";
// const AboutUs = lazy(() => import("./pages/AboutUs"));
>>>>>>> Stashed changes

import HeatMap from "./components/Heatmap";
import VoiceToText from "./components/VoiceToText";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
// import Blogs from "./pages/Blog";
import ScrollToTop from "./lib/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import RecentIncidents from "./pages/RecentIncidents";
import FeedbackForm from "./pages/FeedbackForm";
<<<<<<< Updated upstream
=======
// import { IncidentsProvider } from "./context/IncidentsContext"; not in use anymore
import chatbotTrial from "./pages/chatbotTrial";
import ConversationsList from "./pages/chatbotTrial";
>>>>>>> Stashed changes

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js")
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
<<<<<<< Updated upstream
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
              <Route path="/blogs" element={<RecentIncidents />} />
              <Route path="/feedback" element={<FeedbackForm />} />
            </Routes>
          </BrowserRouter>
        </IncidentsProvider>
=======
        <BrowserRouter>
          <ScrollToTop />
          <Navbar1 />
          {/* <Suspense fallback={<div className="loader"></div>}> */}
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
            <Route path="/chatbot" element={<ConversationsList />} />
          </Routes>
          {/* </Suspense> */}
        </BrowserRouter>
>>>>>>> Stashed changes
      </div>
    </AuthProvider>
  );
};

export default App;
