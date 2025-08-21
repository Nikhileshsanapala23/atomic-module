import React, { useState, useEffect, useRef, useCallback } from 'react';

// Element data for the periodic table selector
const elementsData = [
    { atomicNumber: 1, symbol: "H", name: "Hydrogen", protons: 1, neutrons: 0, electrons: 1 },
    { atomicNumber: 2, symbol: "He", name: "Helium", protons: 2, neutrons: 2, electrons: 2 },
    { atomicNumber: 3, symbol: "Li", name: "Lithium", protons: 3, neutrons: 4, electrons: 3 },
    { atomicNumber: 4, symbol: "Be", name: "Beryllium", protons: 4, neutrons: 5, electrons: 4 },
    { atomicNumber: 5, symbol: "B", name: "Boron", protons: 5, neutrons: 6, electrons: 5 },
    { atomicNumber: 6, symbol: "C", name: "Carbon", protons: 6, neutrons: 6, electrons: 6 },
    { atomicNumber: 7, symbol: "N", name: "Nitrogen", protons: 7, neutrons: 7, electrons: 7 },
    { atomicNumber: 8, symbol: "O", name: "Oxygen", protons: 8, neutrons: 8, electrons: 8 },
    { atomicNumber: 9, symbol: "F", name: "Fluorine", protons: 9, neutrons: 10, electrons: 9 },
    { atomicNumber: 10, symbol: "Ne", name: "Neon", protons: 10, neutrons: 10, electrons: 10 },
    { atomicNumber: 11, symbol: "Na", name: "Sodium", protons: 11, neutrons: 12, electrons: 11 },
    { atomicNumber: 12, symbol: "Mg", name: "Magnesium", protons: 12, neutrons: 12, electrons: 12 },
    { atomicNumber: 13, symbol: "Al", name: "Aluminum", protons: 13, neutrons: 14, electrons: 13 },
    { atomicNumber: 14, symbol: "Si", name: "Silicon", protons: 14, neutrons: 14, electrons: 14 },
    { atomicNumber: 15, symbol: "P", name: "Phosphorus", protons: 15, neutrons: 16, electrons: 15 },
    { atomicNumber: 16, symbol: "S", name: "Sulfur", protons: 16, neutrons: 16, electrons: 16 },
    { atomicNumber: 17, symbol: "Cl", name: "Chlorine", protons: 17, neutrons: 18, electrons: 17 },
    { atomicNumber: 18, symbol: "Ar", name: "Argon", protons: 18, neutrons: 22, electrons: 18 },
];

// Main App Component
const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-blue-50 p-4 font-inter">
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        /* Custom styles for nucleus and electron */
        .nucleus {
          position: relative;
          width: 100px;
          height: 100px;
          background-color: #ef4444; /* Red for nucleus */
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          padding: 10px;
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease-in-out;
          transform-style: preserve-3d; /* For subtle 3D effect */
        }
        .particle {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          margin: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: white;
          font-weight: bold;
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
          transition: transform 0.2s ease-out, background-color 0.2s ease-out;
          backface-visibility: hidden; /* Prevent flickering */
        }
        .particle:hover {
            transform: scale(1.15) translateZ(5px); /* More pronounced hover */
            cursor: grab;
        }
        .proton { background-color: #3b82f6; /* Blue */ }
        .neutron { background-color: #6b7280; /* Gray */ }

        /* Electron orbit animations */
        .electron-container {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transform-style: preserve-3d;
        }
        .electron-orbit {
          position: absolute;
          border: 1.5px solid rgba(100, 100, 100, 0.3); /* Solid, clearer orbits */
          border-radius: 50%;
          animation: pulse-orbit 3s infinite alternate ease-in-out;
          transform-style: preserve-3d;
        }
        @keyframes pulse-orbit {
            from { border-color: rgba(100, 100, 100, 0.3); box-shadow: 0 0 5px rgba(0,0,0,0.1); }
            to { border-color: rgba(150, 150, 150, 0.5); box-shadow: 0 0 15px rgba(0,0,0,0.2); }
        }

        .electron {
          position: absolute;
          width: 18px;
          height: 18px;
          background-color: #10b981; /* Emerald green */
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.9), 0 0 2px rgba(255,255,255,0.7); /* Added white inner glow */
          animation-name: orbit;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          transform-origin: 50% 50%;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        /* Define multiple orbit animations for varying speeds and directions */
        .orbit-speed-1 { animation-duration: 4s; animation-direction: normal; }
        .orbit-speed-2 { animation-duration: 5s; animation-direction: reverse; }
        .orbit-speed-3 { animation-duration: 6s; animation-direction: normal; }
        .orbit-speed-4 { animation-duration: 7s; animation-direction: reverse; }
        .orbit-speed-5 { animation-duration: 8s; animation-direction: normal; }
        .orbit-speed-6 { animation-duration: 4.5s; animation-direction: reverse; }


        @keyframes orbit {
          from { transform: rotateY(0deg) rotateX(20deg) translateX(var(--orbit-radius)) rotateY(0deg); }
          to { transform: rotateY(360deg) rotateX(20deg) translateX(var(--orbit-radius)) rotateY(-360deg); }
        }

        /* Button styles */
        .control-button {
          padding: 0.75rem 1.75rem; /* Slightly larger buttons */
          font-size: 1.15rem;
          font-weight: bold;
          border-radius: 9999px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), inset 0 2px 4px rgba(255,255,255,0.3); /* Stronger shadow, added inner shadow */
          background-image: linear-gradient(to right, var(--tw-gradient-stops));
          background-size: 200% auto;
          color: black; /* Changed button text color to black */
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden; /* For ripple effect */
        }
        .control-button:hover {
          background-position: right center;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255,255,255,0.5);
          transform: translateY(-2px); /* Lift effect */
        }
        .control-button:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255,255,255,0.3);
        }
        .control-button.blue {
          --tw-gradient-from: #1e3a8a; /* Darker blue start */
          --tw-gradient-to: #3b82f6; /* Brighter blue end */
        }
        .control-button.gray {
          --tw-gradient-from: #374151; /* Darker gray start */
          --tw-gradient-to: #6b7280; /* Lighter gray end */
        }
        .control-button.emerald {
          --tw-gradient-from: #047857; /* Darker emerald start */
          --tw-gradient-to: #10b981; /* Brighter emerald end */
        }

        /* Ripple effect for buttons */
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple-animation 0.6s linear;
          background-color: rgba(255, 255, 255, 0.7);
        }
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        /* General styling for sections */
        section {
            background-color: #ffffff;
            border-radius: 1.5rem; /* More rounded corners */
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); /* Deeper shadow */
            padding: 2.5rem;
            margin-bottom: 2.5rem;
        }

        /* Periodic table grid styling */
        .periodic-table-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); /* Responsive columns */
            gap: 8px;
            padding: 1rem;
            background-color: #f3f4f6;
            border-radius: 1rem;
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
            max-height: 300px; /* Limit height for scrollability */
            overflow-y: auto; /* Enable scrolling */
        }
        .element-tile {
            background-color: #e0f2fe; /* Light blue */
            border: 1px solid #90cdf4;
            border-radius: 0.5rem;
            padding: 0.5rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            font-size: 0.9rem;
            font-weight: 600;
        }
        .element-tile:hover {
            background-color: #90cdf4; /* Darker blue on hover */
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            color: white;
        }
        .element-tile.selected {
            background-color: #3b82f6; /* Blue for selected */
            color: white;
            border-color: #2563eb;
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
            transform: scale(1.08);
        }
      `}</style>
      <header className="text-center mb-12">
        <h1 className="text-6xl font-extrabold text-fuchsia-800 mb-4 tracking-tighter leading-tight">
          🔬 Unlock the Atom's Secrets!
        </h1>
        <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Embark on an interactive journey to discover the fundamental particles that make up everything around us. Manipulate atoms and explore their hidden properties!
        </p>
      </header>

      <section>
        <h2 className="text-4xl font-bold text-fuchsia-700 mb-8 text-center">
          The Unseen World: Protons, Neutrons, Electrons
        </h2>
        <p className="text-xl text-gray-700 leading-relaxed mb-8 text-center max-w-4xl mx-auto">
          Every material, living or non-living, is composed of microscopic units called <span className="font-semibold text-blue-600">atoms</span>. Within these atoms lie even tinier <span className="font-semibold text-purple-600">subatomic particles</span>, each with a unique role in defining an atom's identity and behavior.
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-10">
          <li className="p-6 bg-blue-50 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300">
            <span className="text-5xl mb-3 block">➕</span>
            <h3 className="text-2xl font-bold text-blue-700 mt-2">Protons</h3>
            <p className="text-gray-600 text-lg">Positively charged particles located in the atom's central core, the nucleus. They determine the element's identity!</p>
          </li>
          <li className="p-6 bg-gray-50 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300">
            <span className="text-5xl mb-3 block">⚪</span>
            <h3 className="text-2xl font-bold text-gray-700 mt-2">Neutrons</h3>
            <p className="text-gray-600 text-lg">Neutral particles (no charge) also found in the nucleus. They contribute to the atom's mass.</p>
          </li>
          <li className="p-6 bg-emerald-50 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300">
            <span className="text-5xl mb-3 block">➖</span>
            <h3 className="text-2xl font-bold text-emerald-700 mt-2">Electrons</h3>
            <p className="text-gray-600 text-lg">Negatively charged particles that orbit the nucleus in specific energy levels or shells. They dictate chemical reactivity!</p>
          </li>
        </ul>
      </section>

      <AtomBuilder />

      <ElectronShells />

      <footer className="text-center mt-16 text-gray-600 text-lg">
        <p>Created with passion by Nikhilesh ❤️</p>
      </footer>
    </div>
  );
};

// Atom Builder Component
const AtomBuilder = () => {
  const [protons, setProtons] = useState(6);
  const [neutrons, setNeutrons] = useState(6);
  const [electrons, setElectrons] = useState(6);
  const [selectedElementSymbol, setSelectedElementSymbol] = useState("C");

  const atomicNumber = protons;
  const massNumber = protons + neutrons;
  const charge = protons - electrons;

  const getElementByAtomicNumber = (atomicNum) => {
    return elementsData.find(el => el.atomicNumber === atomicNum);
  };

  const currentElement = getElementByAtomicNumber(atomicNumber);
  const elementName = currentElement ? `${currentElement.name} (${currentElement.symbol})` : `Unknown Element (${atomicNumber})`;

  const handleElementSelect = useCallback((element) => {
    setProtons(element.protons);
    setNeutrons(element.neutrons);
    setElectrons(element.electrons);
    setSelectedElementSymbol(element.symbol);
  }, []);

  const calculateOrbitRadius = useCallback((index) => {
    const baseRadius = 70;
    const spacing = 35; // Increased spacing for more distinct orbits
    return baseRadius + (index * spacing);
  }, []);

  const addRippleEffect = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
    circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }
    button.appendChild(circle);
  };

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between gap-10">
      <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
        <h2 className="text-4xl font-bold text-fuchsia-700 mb-8 text-center lg:text-left">
          Interactive Atom Builder! 🧪
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Start by selecting an element from the periodic table below, or directly manipulate the particles to observe changes in atomic properties.
        </p>

        {/* Element Selector */}
        <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center lg:text-left">Choose an Element:</h3>
            <div className="periodic-table-grid">
                {elementsData.map(element => (
                    <div
                        key={element.atomicNumber}
                        className={`element-tile ${selectedElementSymbol === element.symbol ? 'selected' : ''}`}
                        onClick={() => handleElementSelect(element)}
                    >
                        <div className="font-bold text-lg">{element.symbol}</div>
                        <div className="text-xs">{element.atomicNumber}</div>
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-5 bg-blue-50 rounded-xl shadow-sm border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-700">Protons ({protons})</h3>
            <div className="flex justify-center gap-3 mt-3">
              <button
                onClick={(e) => { setProtons(p => Math.max(1, p - 1)); addRippleEffect(e); }}
                className="control-button blue text-2xl"
              >
                -
              </button>
              <button
                onClick={(e) => { setProtons(p => p + 1); addRippleEffect(e); }}
                className="control-button blue text-2xl"
              >
                +
              </button>
            </div>
          </div>
          <div className="p-5 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700">Neutrons ({neutrons})</h3>
            <div className="flex justify-center gap-3 mt-3">
              <button
                onClick={(e) => { setNeutrons(n => Math.max(0, n - 1)); addRippleEffect(e); }}
                className="control-button gray text-2xl"
              >
                -
              </button>
              <button
                onClick={(e) => { setNeutrons(n => n + 1); addRippleEffect(e); }}
                className="control-button gray text-2xl"
              >
                +
              </button>
            </div>
          </div>
          <div className="p-5 bg-emerald-50 rounded-xl shadow-sm border border-emerald-200">
            <h3 className="text-xl font-semibold text-emerald-700">Electrons ({electrons})</h3>
            <div className="flex justify-center gap-3 mt-3">
              <button
                onClick={(e) => { setElectrons(e => Math.max(0, e - 1)); addRippleEffect(e); }}
                className="control-button emerald text-2xl"
              >
                -
              </button>
              <button
                onClick={(e) => { setElectrons(e => e + 1); addRippleEffect(e); }}
                className="control-button emerald text-2xl"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="bg-fuchsia-50 rounded-xl shadow-inner p-6 text-center border border-fuchsia-200">
          <p className="text-xl font-bold text-fuchsia-800 mb-2">Current Atomic Properties:</p>
          <p className="text-lg text-fuchsia-700 mb-1">
            Element: <span className="font-extrabold text-blue-900">{elementName}</span>
          </p>
          <p className="text-lg text-fuchsia-700 mb-1">
            Atomic Number (Z): <span className="font-bold">{atomicNumber}</span> (Number of Protons)
          </p>
          <p className="text-lg text-fuchsia-700 mb-1">
            Mass Number (A): <span className="font-bold">{massNumber}</span> (Protons + Neutrons)
          </p>
          <p className={`text-xl font-extrabold ${charge === 0 ? 'text-emerald-700' : (charge > 0 ? 'text-red-700' : 'text-blue-700')} mt-2`}>
            Net Charge: <span className="font-bold">{charge}</span>
            {charge === 0 && " (Neutral Atom)"}
            {charge > 0 && " (Positive Ion - Cation)"}
            {charge < 0 && " (Negative Ion - Anion)"}
          </p>
          {(currentElement && neutrons !== currentElement.neutrons) && (
            <p className="text-md text-gray-600 mt-4 p-2 bg-orange-100 border border-orange-300 rounded-lg">
              💡 This is an <span className="font-extrabold text-orange-800">Isotope</span> of {currentElement.name}! Isotopes of an element have the same number of protons but different numbers of neutrons.
            </p>
          )}
          {charge !== 0 && (
            <p className="text-md text-gray-600 mt-4 p-2 bg-pink-100 border border-pink-300 rounded-lg">
              💡 This is an <span className="font-extrabold text-pink-800">Ion</span>! Ions are atoms with a net electrical charge due to an unequal number of protons and electrons.
            </p>
          )}
        </div>
      </div>

      <div className="lg:w-1/2 flex items-center justify-center relative min-h-[400px] perspective-1000">
        {/* Visual Atom Representation */}
        <div className="nucleus">
          {Array.from({ length: protons }).map((_, i) => (
            <div key={`p-${i}`} className="particle proton">P+</div>
          ))}
          {Array.from({ length: neutrons }).map((_, i) => (
            <div key={`n-${i}`} className="particle neutron">N</div>
          ))}
        </div>
        <div className="electron-container">
            {Array.from({ length: electrons }).map((_, i) => {
                const orbitRadius = calculateOrbitRadius(i);
                // Cycle through a few orbit speeds and directions for variety
                const speedClass = `orbit-speed-${(i % 6) + 1}`;
                return (
                    <React.Fragment key={`e-frag-${i}`}>
                        <div
                            className="electron-orbit"
                            style={{
                                width: `${orbitRadius * 2}px`,
                                height: `${orbitRadius * 2}px`,
                                left: `calc(50% - ${orbitRadius}px)`,
                                top: `calc(50% - ${orbitRadius}px)`,
                                animationDuration: `${(i % 3) * 0.5 + 3}s` // Orbit pulse slightly slower
                            }}
                        ></div>
                        <div
                            className={`electron ${speedClass}`}
                            style={{
                                '--orbit-radius': `${orbitRadius}px`,
                                animationDelay: `${i * 0.4}s`, // Staggered start times
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        ></div>
                    </React.Fragment>
                );
            })}
        </div>
      </div>
    </section>
  );
};

// Electron Shells Component
const ElectronShells = () => {
  const [electronCount, setElectronCount] = useState(6);
  const [shells, setShells] = useState([0, 0, 0]);
  const electronRefs = useRef([]);

  const maxShellCapacities = [2, 8, 18]; // K, L, M shells (simplified for Class 10)

  useEffect(() => {
    let remainingElectrons = electronCount;
    const newShells = [0, 0, 0];

    newShells[0] = Math.min(remainingElectrons, maxShellCapacities[0]);
    remainingElectrons -= newShells[0];

    if (remainingElectrons > 0) {
      newShells[1] = Math.min(remainingElectrons, maxShellCapacities[1]);
      remainingElectrons -= newShells[1];
    }

    if (remainingElectrons > 0) {
      newShells[2] = Math.min(remainingElectrons, maxShellCapacities[2]);
      remainingElectrons -= newShells[2];
    }

    setShells(newShells);

    // Re-trigger electron appearance animation
    electronRefs.current.forEach(el => {
      if (el) {
        el.style.opacity = 0;
        el.style.transform = 'scale(0.5)';
        setTimeout(() => {
          el.style.opacity = 1;
          el.style.transform = 'scale(1)';
        }, 150); // Slightly longer delay for smoother transition
      }
    });

  }, [electronCount]);

  const orbitRadii = [80, 140, 200]; // Radii for K, L, M shells

  return (
    <section className="flex flex-col items-center">
      <h2 className="text-4xl font-bold text-fuchsia-700 mb-8 text-center">
        Electron Shells & Configuration ⚛️
      </h2>
      <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-4xl mx-auto">
        Electrons occupy distinct energy levels, or "shells," around the nucleus. The way these shells are filled determines an atom's chemical behavior. Observe how electrons arrange themselves!
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 w-full max-w-lg">
        <label htmlFor="electron-slider" className="text-xl font-bold text-gray-800 whitespace-nowrap">
          Total Electrons: <span className="text-fuchsia-700 text-2xl">{electronCount}</span>
        </label>
        <input
          type="range"
          id="electron-slider"
          min="1"
          max="20"
          value={electronCount}
          onChange={(e) => setElectronCount(parseInt(e.target.value))}
          className="w-full h-3 bg-fuchsia-200 rounded-lg appearance-none cursor-pointer accent-fuchsia-600 shadow-inner"
        />
      </div>

      <div className="relative flex items-center justify-center w-full max-w-xl aspect-square mb-8 perspective-1000">
        {/* Nucleus */}
        <div className="absolute w-28 h-28 bg-red-600 rounded-full flex items-center justify-center text-white font-extrabold text-xl shadow-lg z-10 animate-pulse-light transform-style-preserve-3d">
          Nucleus
        </div>

        {/* Shells and Electrons */}
        {shells.map((count, shellIndex) => (
          <div
            key={`shell-${shellIndex}`}
            className="electron-orbit absolute border-2 border-solid border-gray-400 flex items-center justify-center"
            style={{
              width: `${orbitRadii[shellIndex] * 2}px`,
              height: `${orbitRadii[shellIndex] * 2}px`,
              left: `calc(50% - ${orbitRadii[shellIndex]}px)`,
              top: `calc(50% - ${orbitRadii[shellIndex]}px)`,
              animationDuration: `${(shellIndex + 1) * 3 + 1}s`, // Vary pulse speed
              transform: `rotateX(30deg) rotateY(${shellIndex * 15}deg)` // Slight tilt for depth
            }}
          >
            <span className="absolute text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded-md shadow-sm" style={{ top: shellIndex === 0 ? '-2rem' : 'auto', left: '50%', transform: 'translateX(-50%)', bottom: shellIndex > 0 ? '-2rem' : 'auto' }}>
              {shellIndex === 0 ? 'K-Shell' : shellIndex === 1 ? 'L-Shell' : 'M-Shell'} (Max: {maxShellCapacities[shellIndex]})
            </span>
            {Array.from({ length: count }).map((_, electronIndex) => (
              <div
                key={`s${shellIndex}-e${electronIndex}`}
                ref={el => electronRefs.current[shellIndex * maxShellCapacities[shellIndex] + electronIndex] = el}
                className="electron w-5 h-5 bg-emerald-500 animate-fade-in"
                style={{
                  animation: `orbit ${((shellIndex + 1) * 2) + 2}s linear infinite`,
                  animationDelay: `${(electronIndex * 0.3) + (shellIndex * 0.6)}s`,
                  '--orbit-radius': `${orbitRadii[shellIndex]}px`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-fuchsia-50 rounded-xl shadow-inner p-6 text-center border border-fuchsia-200">
        <p className="text-xl font-bold text-fuchsia-800 mb-2">Electron Distribution Summary:</p>
        <p className="text-lg text-fuchsia-700 mb-1">
          K-Shell: <span className="font-bold">{shells[0]}</span> electrons
          {shells[0] === maxShellCapacities[0] && <span className="text-sm text-emerald-700 ml-2">(Full!)</span>}
        </p>
        <p className="text-lg text-fuchsia-700 mb-1">
          L-Shell: <span className="font-bold">{shells[1]}</span> electrons
          {shells[1] === maxShellCapacities[1] && <span className="text-sm text-emerald-700 ml-2">(Full!)</span>}
        </p>
        <p className="text-lg text-fuchsia-700">
          M-Shell: <span className="font-bold">{shells[2]}</span> electrons
          {shells[2] === maxShellCapacities[2] && <span className="text-sm text-emerald-700 ml-2">(Full!)</span>}
        </p>
        {electronCount > 2 && shells[1] === 0 && (
            <p className="text-md text-gray-600 mt-4 p-2 bg-cyan-100 border border-cyan-300 rounded-lg">
              💡 <span className="font-bold">Key Rule:</span> Electrons always fill the lowest energy shells first (innermost shells) before moving to higher energy shells!
            </p>
        )}
        {shells[1] === maxShellCapacities[1] && electronCount > maxShellCapacities[0] && (
            <p className="text-md text-gray-600 mt-4 p-2 bg-lime-100 border border-lime-300 rounded-lg">
              💡 <span className="font-bold">Octet Rule Hint:</span> For Class 10, remember that atoms often achieve stability with 8 electrons in their outermost shell (the Octet Rule)!
            </p>
        )}
      </div>
    </section>
  );
};

export default App;
