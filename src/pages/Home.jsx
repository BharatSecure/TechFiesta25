import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sos from "../components/Sos";
import OurFeatures from "../components/OurFeatures";
import Analytics from "../components/Analytics";
// import AnalyticsSection from "../components/AnalyticsSection";
import Footer from "../components/Footer";
import FAQSection from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import FadeInComponent from "../lib/FadeInComponent";

const Home = () => {
  const faqRef = useRef(null); // Reference to the FAQ section
  const location = useLocation();

  // Effect hook to check if we need to scroll to FAQ section
  useEffect(() => {
    if (location.state?.scrollToFaq && faqRef.current) {
      const offset = 70; // Adjust this value as needed
      const targetPosition =
        faqRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: targetPosition - offset, behavior: "smooth" });
    }
  }, [location.state]);

  return (
    <div>
      <Sos />
      <OurFeatures />
      <FadeInComponent>
        <Analytics />
      </FadeInComponent>
      <FadeInComponent>
        <Testimonials />
      </FadeInComponent>
      <FadeInComponent>
        <section ref={faqRef}>
          <FAQSection />
        </section>
      </FadeInComponent>
      <Footer />
    </div>
  );
};

export default Home;
