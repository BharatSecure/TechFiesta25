import React, { useRef } from "react";
import Hero from "../components/about-components/Hero.jsx";
import Features from "../components/about-components/Features.jsx";
import Team from "../components/about-components/Team.jsx";
import Video from "../components/about-components/Video.jsx";
import AboutUsDetails from "../components/about-components/AboutUsDetails.jsx";
import Footer from "../components/Footer.jsx";

const AboutUs = () => {
  const featuresRef = useRef(null); 
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "ubuntu", backgroundColor: "white" }}>
      <Hero onLearnMore={scrollToFeatures} />
      <AboutUsDetails />
      {" "}
      {/* Pass scroll function as prop */}
      <Features ref={featuresRef} /> {/* Attach ref to Features component */}
      <Video />
      <Team />
      <Footer/>
    </div>
  );
};

export default AboutUs;
