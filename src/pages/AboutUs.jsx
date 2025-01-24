import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/about-components/Hero.jsx";
import Features from "../components/about-components/Features.jsx";
import Team from "../components/about-components/Team.jsx";
import Video from "../components/about-components/Video.jsx";
import AboutUsDetails from "../components/about-components/AboutUsDetails.jsx";
import Footer from "../components/Footer.jsx";

const AboutUs = () => {
  const featuresRef = useRef(null); // Create a reference for Features section
  const location = useLocation(); // Get the current location

  useEffect(() => {
    // Scroll to the Features section if the hash is '#features'
    if (location.hash === "#features") {
      const offset = 60; // Adjust this value as per your requirement
      const targetPosition =
        featuresRef.current?.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: targetPosition - offset, behavior: "smooth" });
    }
  }, [location]); // Run when the location changes

  const scrollToFeatures = () => {
    const offset = 60; // Adjust this value as per your requirement
    const targetPosition =
      featuresRef.current?.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: targetPosition - offset, behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "ubuntu", backgroundColor: "white" }}>
      <Hero onLearnMore={scrollToFeatures} />
      <AboutUsDetails />
      <Features ref={featuresRef} /> {/* Attach ref to Features */}
      <Video />
      <Team />
      <Footer />
    </div>
  );
};

export default AboutUs;
