import React, { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Text } from '@react-three/drei';
import { ArrowLeft, Info, Settings, RotateCcw } from 'lucide-react';
import * as THREE from 'three';
import './AtomicStructureModule.css';

// Nucleus component with protons and neutrons
function Nucleus({ position, onClick, atomicNumber = 6 }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.008;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#ff6b6b" : "#e74c3c"} 
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Protons */}
      {[...Array(atomicNumber)].map((_, i) => {
        const angle = (i / atomicNumber) * Math.PI * 2;
        const radius = 0.3;
        return (
          <mesh key={`proton-${i}`} position={[
            radius * Math.cos(angle),
            radius * Math.sin(angle) * 0.5,
            radius * Math.sin(angle) * Math.cos(angle)
          ]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#3498db" />
          </mesh>
        );
      })}
      
      {/* Neutrons */}
      {[...Array(atomicNumber)].map((_, i) => {
        const angle = (i / atomicNumber) * Math.PI * 2 + Math.PI / atomicNumber;
        const radius = 0.35;
        return (
          <mesh key={`neutron-${i}`} position={[
            radius * Math.cos(angle),
            radius * Math.sin(angle) * -0.5,
            radius * Math.sin(angle) * Math.cos(angle)
          ]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#95a5a6" />
          </mesh>
        );
      })}

      {/* Nucleus label */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.2}
        color="#2c3e50"
        anchorX="center"
        anchorY="middle"
      >
        Nucleus
      </Text>
    </group>
  );
}

// Electron component
function Electron({ 
  orbitRadius, 
  speed, 
  color, 
  inclination = 0, 
  phase = 0,
  onHover,
  electronId,
  shellName
}) {
  const meshRef = useRef();
  const trailRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase;
    if (meshRef.current) {
      const x = orbitRadius * Math.cos(t);
      const y = orbitRadius * Math.sin(t) * Math.sin(inclination);
      const z = orbitRadius * Math.sin(t) * Math.cos(inclination);
      
      meshRef.current.position.set(x, y, z);
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    onHover(electronId, shellName);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover(null);
  };

  return (
    <group>
      {/* Orbit path */}
      <mesh rotation={[inclination, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 64]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.15} 
          side={THREE.DoubleSide} 
        />
      </mesh>
      
      {/* Electron */}
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={hovered ? 1.3 : 1}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.2}
        />
      </mesh>

      {/* Shell label */}
      <Text
        position={[orbitRadius + 0.5, 0, 0]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {shellName}
      </Text>
    </group>
  );
}

// Main module component
const AtomicStructureModule = ({ onBackToHome }) => {
  const [selectedInfo, setSelectedInfo] = useState('overview');
  const [hoveredElement, setHoveredElement] = useState(null);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedAtom, setSelectedAtom] = useState('carbon');

  const atoms = {
    hydrogen: { name: 'Hydrogen', protons: 1, neutrons: 0, electrons: [1] },
    carbon: { name: 'Carbon', protons: 6, neutrons: 6, electrons: [2, 4] },
    oxygen: { name: 'Oxygen', protons: 8, neutrons: 8, electrons: [2, 6] },
    sodium: { name: 'Sodium', protons: 11, neutrons: 12, electrons: [2, 8, 1] }
  };

  const currentAtom = atoms[selectedAtom];

  const handleElementHover = useCallback((elementId, shellName) => {
    setHoveredElement({ id: elementId, shell: shellName });
    if (elementId) {
      setSelectedInfo(`electron-${shellName}`);
    }
  }, []);

  const getInfoContent = () => {
    switch (selectedInfo) {
      case 'nucleus':
        return {
          title: 'Atomic Nucleus',
          content: `The nucleus contains ${currentAtom.protons} protons and ${currentAtom.neutrons} neutrons. It's extremely small but contains 99.9% of the atom's mass.`,
          facts: [
            'Protons have positive charge (+1)',
            'Neutrons have no charge (neutral)',
            'Nuclear diameter ≈ 10⁻¹⁵ meters'
          ]
        };
      case 'electron-K':
        return {
          title: 'K Shell (n=1)',
          content: 'The innermost electron shell, closest to the nucleus. Can hold maximum 2 electrons.',
          facts: [
            'Highest binding energy',
            'Spherical orbital shape',
            'Principal quantum number n=1'
          ]
        };
      case 'electron-L':
        return {
          title: 'L Shell (n=2)',
          content: 'The second electron shell from nucleus. Can hold maximum 8 electrons.',
          facts: [
            'Contains s and p orbitals',
            'Principal quantum number n=2',
            'Lower binding energy than K shell'
          ]
        };
      case 'electron-M':
        return {
          title: 'M Shell (n=3)',
          content: 'The third electron shell from nucleus. Can hold maximum 18 electrons.',
          facts: [
            'Contains s, p, and d orbitals',
            'Principal quantum number n=3',
            'Valence shell for sodium'
          ]
        };
      default:
        return {
          title: `${currentAtom.name} Atom`,
          content: `Explore the 3D structure of ${currentAtom.name}. Click and drag to rotate, zoom to get closer, and hover over components to learn more.`,
          facts: [
            `Atomic number: ${currentAtom.protons}`,
            `Mass number: ${currentAtom.protons + currentAtom.neutrons}`,
            `Electron configuration: ${currentAtom.electrons.join(', ')}`
          ]
        };
    }
  };

  const info = getInfoContent();

  const renderElectrons = () => {
    const shells = ['K', 'L', 'M'];
    const colors = ['#e74c3c', '#3498db', '#2ecc71'];
    const radii = [2.5, 4, 5.5];
    const speeds = [1.2, 0.8, 0.5];
    const inclinations = [0, Math.PI / 4, Math.PI / 2];

    return currentAtom.electrons.map((electronCount, shellIndex) => {
      return [...Array(electronCount)].map((_, electronIndex) => (
        <Electron
          key={`${shells[shellIndex]}-${electronIndex}`}
          orbitRadius={radii[shellIndex]}
          speed={speeds[shellIndex]}
          color={colors[shellIndex]}
          inclination={inclinations[shellIndex]}
          phase={(electronIndex * 2 * Math.PI) / electronCount}
          onHover={handleElementHover}
          electronId={`${shells[shellIndex]}-${electronIndex}`}
          shellName={shells[shellIndex]}
        />
      ));
    });
  };

  return (
    <div className="atomic-module">
      {/* Header */}
      <header className="module-header">
        <button className="back-btn" onClick={onBackToHome}>
          <ArrowLeft size={20} />
          Back to Home
        </button>
        <h1>Interactive Atomic Structure</h1>
        <div className="header-controls">
          <select 
            value={selectedAtom} 
            onChange={(e) => setSelectedAtom(e.target.value)}
            className="atom-selector"
          >
            {Object.entries(atoms).map(([key, atom]) => (
              <option key={key} value={key}>{atom.name}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="module-content">
        {/* Side Panel */}
        <div className="side-panel">
          <div className="info-section">
            <div className="info-header">
              <Info size={20} />
              <h3>{info.title}</h3>
            </div>
            <p>{info.content}</p>
            <ul className="fact-list">
              {info.facts.map((fact, index) => (
                <li key={index}>{fact}</li>
              ))}
            </ul>
          </div>

          <div className="controls-section">
            <h4>Controls</h4>
            <div className="control-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={showLabels} 
                  onChange={(e) => setShowLabels(e.target.checked)}
                />
                Show Labels
              </label>
            </div>
            <div className="control-buttons">
              <button 
                className="control-btn"
                onClick={() => setSelectedInfo('nucleus')}
              >
                Focus Nucleus
              </button>
              <button 
                className="control-btn"
                onClick={() => setSelectedInfo('overview')}
              >
                <RotateCcw size={16} />
                Reset View
              </button>
            </div>
          </div>

          <div className="legend">
            <h4>Legend</h4>
            <div className="legend-item">
              <div className="legend-color" style={{backgroundColor: '#e74c3c'}}></div>
              <span>K Shell Electrons</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{backgroundColor: '#3498db'}}></div>
              <span>L Shell Electrons</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{backgroundColor: '#2ecc71'}}></div>
              <span>M Shell Electrons</span>
            </div>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="canvas-container">
          <Canvas 
            camera={{ position: [8, 6, 8], fov: 60 }}
            style={{ background: 'radial-gradient(circle, #1a1a2e 0%, #16213e 100%)' }}
          >
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4fc3f7" />
            <spotLight position={[0, 10, 0]} intensity={0.8} />

            {/* Nucleus */}
            <Nucleus 
              position={[0, 0, 0]} 
              onClick={() => setSelectedInfo('nucleus')}
              atomicNumber={currentAtom.protons}
            />

            {/* Electrons */}
            {renderElectrons()}

            {/* Controls */}
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              maxDistance={20}
              minDistance={5}
            />
          </Canvas>

          {/* Canvas Overlay */}
          <div className="canvas-overlay">
            <div className="instructions">
              <p><strong>Instructions:</strong> Drag to rotate • Scroll to zoom • Hover over particles for details</p>
            </div>
            {hoveredElement && (
              <div className="hover-info">
                <strong>{hoveredElement.shell} Shell Electron</strong>
                <br />Energy Level: n={hoveredElement.shell === 'K' ? 1 : hoveredElement.shell === 'L' ? 2 : 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtomicStructureModule;
