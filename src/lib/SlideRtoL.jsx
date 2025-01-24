import React, { useState, useRef, useEffect } from "react";
//NOT WORKING FOR SMALLER SCREENS DONT USE

const SlideRtoL = ({ children, direction = "right" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -50px 0px" }
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
          opacity: 0;
          transform: translateX(${direction === "right" ? "500px" : "-500px"});
          will-change: transform, opacity;
          transition: opacity 1s ease-out, transform 1s ease-out;
        }

        .slide-in-element.is-visible {
          opacity: 1;
          transform: translateX(0);
        }
        `}
      </style>
      <div
        ref={elementRef}
        className={`slide-in-element ${isVisible ? "is-visible" : ""}`}
      >
        {children}
      </div>
    </>
  );
};

export default SlideRtoL;
