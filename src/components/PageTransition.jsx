import React, { useState, useEffect } from 'react';

const TransitionEffect = ({ type = 'cyber' }) => {
  const [cells, setCells] = useState([]);
  
  useEffect(() => {
    if (type === 'matrix') {
      const newCells = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        delay: Math.random() * 0.5,
        char: String.fromCharCode(0x30A0 + Math.random() * 96)
      }));
      setCells(newCells);
    }
  }, [type]);

  if (type === 'matrix') {
    return (
      <div className="fixed inset-0 grid grid-cols-10 grid-rows-10 z-50">
        {cells.map(cell => (
          <div
            key={cell.id}
            className="bg-cyan-500 animate-matrixFall"
            style={{ animationDelay: `${cell.delay}s` }}
          >
            {cell.char}
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const PageTransition = ({ children, transitionType = 'cyber' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setIsTransitioning(false), 1500);
    return () => {
      clearTimeout(timer);
      setIsVisible(false);
    };
  }, []);

  return (
    <div className="relative">
      {/* Main Content with Advanced Animation */}
      <div
        className={`
          min-h-screen w-full
          transition-all duration-1000 ease-out
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          ${transitionType === 'cyber' ? 'cyber-glitch' : ''}
        `}
      >
        {/* Cyber Lines Effect */}
        <div className={`
          fixed inset-0 pointer-events-none
          ${isTransitioning ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-1000
        `}>
          <div className="absolute inset-0 cyber-grid" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-px w-full animate-scanline"
              style={{
                background: 'linear-gradient(to right, transparent, cyan, transparent)',
                top: `${(i + 1) * 12.5}%`,
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>

        {/* Geometric Shapes Background */}
        <div className={`
          fixed inset-0 pointer-events-none
          ${isTransitioning ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-1000
        `}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              <div className="w-8 h-8 border-2 border-cyan-400/30 rotate-45 animate-spin-slow" />
            </div>
          ))}
        </div>

        {/* Content Wrapper */}
        <div className={`
          relative z-10
          ${isTransitioning ? 'animate-contentReveal' : ''}
        `}>
          {children}
        </div>
      </div>

      {/* Transition Effect Overlay */}
      <TransitionEffect type={transitionType} />
    </div>
  );
};

export default PageTransition;

// Add these styles to your global CSS or as a styled-components
const styles = `
  @keyframes scanline {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes matrixFall {
    0% { transform: translateY(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }

  @keyframes spin-slow {
    to { transform: rotate(360deg); }
  }

  @keyframes contentReveal {
    0% { clip-path: inset(0 100% 0 0); }
    100% { clip-path: inset(0 0 0 0); }
  }

  .cyber-grid {
    background-image: linear-gradient(transparent 97%, cyan 97%),
                      linear-gradient(90deg, transparent 97%, cyan 97%);
    background-size: 40px 40px;
    animation: gridMove 20s linear infinite;
  }

  @keyframes gridMove {
    to { background-position: 40px 40px; }
  }

  .cyber-glitch {
    animation: glitch 1s steps(2, end) infinite;
  }

  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }

  .animate-scanline {
    animation: scanline 2s linear infinite;
  }

  .animate-matrixFall {
    animation: matrixFall 2s linear infinite;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-spin-slow {
    animation: spin-slow 10s linear infinite;
  }

  .animate-contentReveal {
    animation: contentReveal 1s cubic-bezier(0.77, 0, 0.175, 1) forwards;
  }
`;