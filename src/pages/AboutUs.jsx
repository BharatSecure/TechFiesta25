import React from "react";
import Hero from "../../about-components/Hero.jsx"; 
import Features from "../../about-components/Features.jsx";

const AboutUs = () => {
  return (
    <div style={{fontFamily: "ubuntu", backgroundColor:"white"}}>
      <Hero />
      <Features />
    </div>
  );
};

export default AboutUs;
