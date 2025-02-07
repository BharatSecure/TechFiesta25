import React, { useState } from "react";
import styles from "./LanguageSwitcher.module.css";

const LanguageSwitcher = ({ onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.floatingWidget}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        🌐
      </button>
      {isOpen && (
        <div className={styles.dropdown}>
          <p>Select Language:</p>
          <select onChange={(e) => onLanguageChange(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
