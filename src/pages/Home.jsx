import React from "react";
import Sos from "../components/Sos";
import OurFeatures from "../components/OurFeatures";

import Analytics from "../components/Analytics";
import Footer from "../components/Footer";
import FAQSection from "@/components/FAQ";
// import EmergencyGuidelines from "@/components/EmergencyGuidelines";

const Home = () => {
  return (
    <div>
      <Sos />
      <OurFeatures />
      {/* <EmergencyGuidelines /> */}
      <Analytics />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Home;
