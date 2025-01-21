import React, { useRef } from "react";
import Hero from "../../about-components/Hero.jsx";
import Features from "../../about-components/Features.jsx";
import Team from "../../about-components/Team.jsx";
import Video from "../../about-components/Video.jsx";
import Footer from "../components/Footer.jsx";

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
      <Video />
<<<<<<< HEAD
      <Team />
=======
      <Footer/>
>>>>>>> 4b30aa409bf1d73be18fa6ccd66fe505b84f5883
    </div>
  );
};

export default AboutUs;
