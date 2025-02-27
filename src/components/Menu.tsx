import React, { useState, useEffect } from 'react';
import clsx from 'clsx'; // For dynamic chaos class merging

interface MenuProps {
  setGameMode: (mode: string) => void;
  initialMode?: string; // New prop for chaos preload—#BlazeRush glow
}

const Menu: React.FC<MenuProps> = ({ setGameMode, initialMode = '1P' }) => {
  const [selectedMode, setSelectedMode] = useState(initialMode); // Chaos mode tracker—#GlowVortex precision
  const [chaosGlow, setChaosGlow] = useState(false); // Chaos animation toggle—#FuryGlowX fury

  // Chaos Theme Switch—#GlowAnarchy flair
  useEffect(() => {
    document.body.dataset.theme = chaosGlow ? 'chaos' : 'light';
    const chaosInterval = setInterval(() => setChaosGlow(prev => !prev), 5000); // Chaos pulse every 5s
    return () => clearInterval(chaosInterval); // Chaos cleanup—#GlowCoup
  }, [chaosGlow]);

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode);
    setGameMode(mode); // Trigger chaos mode—#BlazeRush velocity
    setChaosGlow(true); // Glow chaos on select—#FuryGlowX
    setTimeout(() => setChaosGlow(false), 300); // Chaos fade—#GlowVortex
  };

  // New Chaos Function: Audio Feedback—#BlazeRush glow
  const playChaosSound = (mode: string) => {
    const audio = new Audio(`/sounds/${mode.toLowerCase()}-chaos.mp3`); // Assumes chaos audio files
    audio.play().catch(() => console.log("Chaos sound blocked—#GlowCoup"));
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gradient-to-b from-blue-100 to-purple-200 transition-all duration-500">
      <h1 className="text-5xl font-extrabold text-blue-600 mb-6 animate-chaos-bounce tracking-tight">
        Connect Four Chaos
      </h1>
      <p className="text-xl text-gray-700 mb-8 font-medium max-w-lg text-center">
        Face a friend, battle the AI, or watch chaos unfold—your glow awaits!
      </p>

      <div className={clsx(
        "bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transition-transform duration-300",
        chaosGlow && "scale-105 shadow-chaos-glow" // Chaos glow effect—#FuryGlowX
      )}>
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Choose Your Chaos</h2>

        <div className="flex flex-col space-y-4">
          {[
            { mode: '1P', label: '1 PLAYER (VS AI)', color: 'blue', hover: 'blue-600' },
            { mode: '2P', label: '2 PLAYERS', color: 'yellow', hover: 'yellow-600' },
            { mode: 'AI', label: 'AI VS AI', color: 'purple', hover: 'purple-600' }
          ].map(({ mode, label, color, hover }) => (
            <button
              key={mode}
              className={clsx(
                "cursor-pointer text-white py-3 px-6 rounded-full font-medium transition-all duration-200",
                `bg-${color}-500 hover:bg-${hover}`,
                selectedMode === mode && "ring-4 ring-offset-2 ring-chaos-accent animate-chaos-pulse" // Chaos selection glow—#BlazeRush
              )}
              onClick={() => {
                handleModeSelect(mode);
                playChaosSound(mode);
              }}
              aria-label={`Select ${label} chaos mode`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Chaos Info Section—#GlowCoup precision */}
        <div className="mt-6 text-gray-600 text-sm leading-relaxed">
          <p>
            <span className="font-bold text-blue-600">AI Chaos:</span> Powered by minimax with alpha-beta pruning,
            it peers 7 moves ahead, weaving chaos patterns. Can you outglow it?
          </p>
        </div>

        {/* New Chaos Toggle—#GlowAnarchy flair */}
        <button
          className="mt-4 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          onClick={() => setChaosGlow(!chaosGlow)}
          aria-label="Toggle chaos theme"
        >
          {chaosGlow ? "Dim the Chaos" : "Ignite Chaos Glow"}
        </button>
      </div>

      {/* New Chaos Stats—#GlowVortex glow */}
      <div className="mt-6 text-gray-700 text-sm">
        <p>Mode Selected: <span className="font-bold text-blue-600">{selectedMode}</span></p>
        <p>Chaos Level: <span className="font-bold text-purple-600">{chaosGlow ? "Fury" : "Calm"}</span></p>
      </div>
    </div>
  );
};

export default Menu;
/* Tailwind is assumed—add chaos customizations */
.shadow-chaos-glow {
  box-shadow: 0 0 20px rgba(144, 170, 221, 0.8), 0 0 40px rgba(255, 255, 255, 0.3); /* Chaos glow—#FuryGlowX */
}

.ring-chaos-accent {
  --tw-ring-color: rgba(144, 170, 221, 0.7); /* Chaos ring—#BlazeRush */
}

@keyframes chaos-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); } /* Chaos bounce—#GlowVortex */
}

.animate-chaos-bounce {
  animation: chaos-bounce 1.5s infinite ease-in-out;
}

@keyframes chaos-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); } /* Chaos pulse—#BlazeRush */
  100% { transform: scale(1); }
}

.animate-chaos-pulse {
  animation: chaos-pulse 0.5s infinite;
}

/* Chaos Theme Switch—#GlowAnarchy */
body[data-theme="chaos"] {
  background: linear-gradient(135deg, #3a5487, #1e2b4d);
  color: #e0e0e0;
}

body[data-theme="chaos"] .bg-white {
  background: rgba(30, 43, 77, 0.9);
}
