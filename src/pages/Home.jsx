import React, { useRef, useEffect, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import Sos from "../components/Sos";
import OurFeatures from "../components/OurFeatures";
import FadeInComponent from "../lib/FadeInComponent";
import FloatingChatbot from "@/components/FloatingChatbot";

// Lazy load non-critical components
const Analytics = lazy(() => import("../components/Analytics"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const FAQSection = lazy(() => import("@/components/FAQ"));
const Footer = lazy(() => import("../components/Footer"));

const Home = () => {
  const faqRef = useRef(null); //ref to FAQ section
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToFaq && faqRef.current) {
      const offset = 70; //adjust offset
      const targetPosition =
        faqRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: targetPosition - offset, behavior: "smooth" });
    }
  }, [location.state]);

  return (
    <div>
      <Sos />
      <OurFeatures />

      <Suspense
        fallback={
          <div style={{ height: "40%", width: "100%" }}>
            <div className="loader"></div>
          </div>
        }
      >
        <FadeInComponent>
          <Analytics />
        </FadeInComponent>
      </Suspense>

      <Suspense fallback={<div className="loader"></div>}>
        <FadeInComponent>
          <Testimonials />
        </FadeInComponent>
      </Suspense>

      <Suspense fallback={<div className="loader"></div>}>
        <FadeInComponent>
          <section ref={faqRef}>
            <FAQSection />
          </section>
        </FadeInComponent>
      </Suspense>

      <Suspense fallback={<div className="loader"></div>}>
        <Footer />
      </Suspense>

      <FloatingChatbot/>
    </div>
  );
};

export default Home;
