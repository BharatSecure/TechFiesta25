import React, { useRef } from "react";
import Hero from "../../about-components/Hero.jsx";
import Features from "../../about-components/Features.jsx";
import Team from "../../about-components/Team.jsx";

const AboutUs = () => {
  const featuresRef = useRef(null); 
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "ubuntu", backgroundColor: "white" }}>
      <Hero onLearnMore={scrollToFeatures} />{" "}
      {/* Pass scroll function as prop */}
      <Features ref={featuresRef} /> {/* Attach ref to Features component */}
      <Team />
    </div>
  );
};

export default AboutUs;
