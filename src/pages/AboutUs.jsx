import React, { useRef } from "react";
import Hero from "../../about-components/Hero.jsx";
import Features from "../../about-components/Features.jsx";

const AboutUs = () => {
  const featuresRef = useRef(null); // Create a ref for the Features section

  // Function to scroll to the Features section
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "ubuntu", backgroundColor: "white" }}>
      <Hero onLearnMore={scrollToFeatures} />{" "}
      {/* Pass scroll function as prop */}
      <Features ref={featuresRef} /> {/* Attach ref to Features component */}
    </div>
  );
};

export default AboutUs;
