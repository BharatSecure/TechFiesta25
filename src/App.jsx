import React from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import IncidentReportForm from "./pages/IncidentReportForm";
import UserDashboard from "./pages/UserDashboard";
import { IncidentsProvider } from "./context/IncidentsContext";
import AdminDashboard from "./pages/AdminDashboard";
import AboutUs from "../about-components/Hero";
import 'animate.css';

const App = () => {
  return (
    <div>
      <IncidentsProvider>
        <BrowserRouter>
          <Navbar />
         
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report-incident" element={<IncidentReportForm />} />
            <Route path="/my-reports" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </BrowserRouter>
      </IncidentsProvider>
    </div>
  );
};

export default App;
