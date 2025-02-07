import React, { useEffect } from "react";

const LanguageSelector = () => {
  useEffect(() => {
    // Define the function globally so Google Translate can call it
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,mr,ta,te,kn,ml,gu,pa,bn",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    // Load the Google Translate script
    const addScript = document.createElement("script");
    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    addScript.async = true;
    document.body.appendChild(addScript);
  }, []);

  return (
    <div
      id="google_translate_element"
      className="fixed top-4 right-4 z-50 bg-white p-2 rounded-md shadow-md"
    ></div>
  );
};

export default LanguageSelector;
