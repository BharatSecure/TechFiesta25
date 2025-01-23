import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sos from "../components/Sos";
import OurFeatures from "../components/OurFeatures";
import Analytics from "../components/Analytics";
import Footer from "../components/Footer";
import FAQSection from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";

const Home = () => {
  const faqRef = useRef(null); // Reference to the FAQ section
  const location = useLocation();

  // Effect hook to check if we need to scroll to FAQ section
  useEffect(() => {
    if (location.state?.scrollToFaq && faqRef.current) {
      faqRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.state]);

  return (
    <div>
      <Sos />
      <OurFeatures />
      <Analytics />
      <Testimonials />
      <section ref={faqRef}>
        <FAQSection />
      </section>
      <Footer />
    </div>
  );
};

export default Home;
