import React from "react";
import { useEffect, useState, useRef } from "react";

const ScaleInComponent = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>{`.scale-in-element {
    opacity: 0;
    transform: scale(0.5); /* Start smaller */
    transition: opacity 1s ease-out, transform 1s ease-out;
  }
  
  .scale-in-element.is-visible {
    opacity: 1;
    transform: scale(1); /* Return to normal size */
  }
  `}</style>
      <div
        ref={elementRef}
        className={`scale-in-element ${isVisible ? "is-visible" : ""}`}
      >
        {children}
      </div>
    </>
  );
};

export default ScaleInComponent;
