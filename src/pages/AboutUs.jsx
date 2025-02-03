import React, { useEffect, useRef, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/about-components/Hero.jsx"; // Keep this loaded for instant render
import FloatingChatbot from "@/components/FloatingChatbot.jsx";

// Lazy load non-critical components
const Features = lazy(() =>
  import("../components/about-components/Features.jsx")
);
const Video = lazy(() => import("../components/about-components/Video.jsx"));
const AboutUsDetails = lazy(() =>
  import("../components/about-components/AboutUsDetails.jsx")
);
const Team = lazy(() => import("../components/about-components/Team.jsx"));
const Footer = lazy(() => import("../components/Footer.jsx"));

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

      <Suspense
        fallback={
          <div style={{ height: "40%", width: "100%" }}>
            <div className="loader"></div>
          </div>
        }
      >
        <AboutUsDetails />
      </Suspense>

      <Suspense
        fallback={
          <div style={{ height: "40%", width: "100%" }}>
            <div className="loader"></div>
          </div>
        }
      >
        <Features ref={featuresRef} />
      </Suspense>

      <Suspense
        fallback={
          <div style={{ height: "40%", width: "100%" }}>
            <div className="loader"></div>
          </div>
        }
      >
        <Video />
      </Suspense>

      <Suspense
        fallback={
          <div style={{ height: "40%", width: "100%" }}>
            <div className="loader"></div>
          </div>
        }
      >
        <Team />
      </Suspense>

      <Suspense
        fallback={
          <div style={{ height: "40%", width: "100%" }}>
            <div className="loader"></div>
          </div>
        }
      >
        <Footer />
      </Suspense>
      <FloatingChatbot/>
    </div>
  );
};

export default AboutUs;
