import React, { useEffect, useRef, useState } from "react";

const FadeInComponent = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // Determine the threshold based on screen size
    const screenWidth = window.innerWidth;
    const thresholdValue = screenWidth < 768 ? 0.1 : 0.25; // Smaller threshold for devices below 768px

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true); // Set to true when element enters the viewport
          } else {
            setIsVisible(false); // Reset to false when element leaves the viewport
          }
        });
      },
      {
        threshold: thresholdValue, // Use dynamic threshold value
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current); // Start observing the element
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current); // Cleanup observer on unmount
      }
    };
  }, []);

  return (
    <>
      <style>{`
        .fade-in-element {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 1s ease-out, transform 1s ease-out;
        }

        .fade-in-element.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      <div
        ref={elementRef}
        className={`fade-in-element ${isVisible ? "is-visible" : ""}`}
      >
        {children}
      </div>
    </>
  );
};

export default FadeInComponent;
