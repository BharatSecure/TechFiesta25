import React from "react";
import { useState, useRef, useEffect } from "react";

const SlideLtoR = ({ children, direction = "left" }) => {
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
      <style>
        {`
      .slide-in-element {
       .slide-in-element {
    opacity: 0;
    transform: translateX(-500px); /* Start off-screen to the left */
    transition: opacity 1s ease-out, transform 1s ease-out;
  }
  
  .slide-in-element.is-visible {
    opacity: 1;
    transform: translateX(0); /* Move to its original position */
  }
  
  .slide-in-right {
    transform: translateX(500px); /* Start off-screen to the right */
  }
  
      `}
      </style>
      <div
        ref={elementRef}
        className={`slide-in-element ${isVisible ? "is-visible" : ""} ${
          direction === "right" ? "slide-in-right" : ""
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default SlideLtoR;
