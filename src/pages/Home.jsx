import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import Sos from "../components/Sos";
import OurFeatures from "../components/OurFeatures";
import FadeInComponent from "../lib/FadeInComponent";
import FloatingChatbot from "@/components/FloatingChatbot";
import Chartglobal from "./Chart-global";

const Testimonials = lazy(() => import("@/components/Testimonials"));
const FAQSection = lazy(() => import("@/components/FAQ"));
const Footer = lazy(() => import("../components/Footer"));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="relative w-16 h-16">
      <div className="w-16 h-16 rounded-full border-4 border-cyan-600/20 border-t-cyan-400 animate-spin"></div>
      <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-pulse"></div>
    </div>
  </div>
);

const Home = () => {
  const [loading, setLoading] = useState(false);
  const faqRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToFaq && faqRef.current) {
      const offset = 70;
      const targetPosition =
        faqRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: targetPosition - offset, behavior: "smooth" });
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://127.0.0.1:8000/api/advanced-incident-analysis/",
          {
            method: "GET",
            headers: { Accept: "application/json" },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        // setData(result);
      } catch (err) {
        // setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Main content wrapper with subtle gradient */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl"></div>
        </div>

        {/* Content sections */}
        <div className="relative z-10">
          {/* SOS Section */}
          <section className="relative">
            <Sos />
          </section>
          <FadeInComponent>
            {/* Features Section */}
            <section className="relative shadow-[inset_0_-20px_30px_-20px_rgba(0,0,0,0.2)]">
              <OurFeatures />
            </section>
          </FadeInComponent>
          {/* <FadeInComponent> */}
          {/* Features Section */}
          <section className="relative shadow-[inset_0_-20px_30px_-20px_rgba(0,0,0,0.2)]">
            <Chartglobal />
          </section>
          {/* </FadeInComponent> */}

          {/* Testimonials Section */}
          <Suspense fallback={<LoadingSpinner />}>
            <FadeInComponent>
              <section className="relative shadow-[inset_0_-20px_30px_-20px_rgba(0,0,0,0.2)]">
                <Testimonials />
              </section>
            </FadeInComponent>
          </Suspense>

          {/* FAQ Section */}
          <Suspense fallback={<LoadingSpinner />}>
            <FadeInComponent>
              <section
                ref={faqRef}
                className="relative shadow-[inset_0_-20px_30px_-20px_rgba(0,0,0,0.2)]"
              >
                <FAQSection />
              </section>
            </FadeInComponent>
          </Suspense>

          {/* Footer */}
          <Suspense fallback={<LoadingSpinner />}>
            <section className="relative bg-slate-800 shadow-[inset_0_20px_30px_-20px_rgba(0,0,0,0.2)] before:absolute before:top-0 before:left-0 before:w-full before:h-2 before:bg-cyan-400 before:blur-md before:opacity-50 before:animate-glow">
              <Footer />
            </section>
          </Suspense>
        </div>
      </div>

      {/* Floating Chatbot with neuromorphic styling */}
      <div className="relative z-50">
        <div className="fixed bottom-6 right-6 shadow-[8px_8px_16px_rgba(0,0,0,0.3),-8px_-8px_16px_rgba(255,255,255,0.1)] rounded-full">
          <FloatingChatbot />
        </div>
      </div>

      {/* Global styles for consistent neuromorphic effects */}
      <style jsx global>{`
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        section {
          position: relative;
          overflow: hidden;
        }

        section::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(34, 211, 238, 0.03),
            transparent,
            rgba(34, 211, 238, 0.03)
          );
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default Home;
