import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Floating magical crystal
function FloatingCrystal({ position, color = '#a78bfa', size = 0.08 }) {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group position={position}>
        {/* Crystal */}
        <mesh ref={meshRef}>
          <octahedronGeometry args={[size, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>
        {/* Glow */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[size * 1.5, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
          />
        </mesh>
        {/* Light */}
        <pointLight
          color={color}
          intensity={0.3}
          distance={1}
          decay={2}
        />
      </group>
    </Float>
  );
}

// Glowing floor runes in a circle
function GlowingRunes() {
  const runesRef = useRef();

  useFrame((state) => {
    if (runesRef.current) {
      runesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const runePositions = useMemo(() => {
    const positions = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.9;
      positions.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        rotation: angle
      });
    }
    return positions;
  }, []);

  return (
    <group ref={runesRef} position={[0, 0.002, 0]}>
      {runePositions.map((pos, i) => (
        <mesh
          key={i}
          position={[pos.x, 0, pos.z]}
          rotation={[-Math.PI / 2, 0, pos.rotation]}
        >
          <planeGeometry args={[0.08, 0.12]} />
          <meshBasicMaterial
            color="#c084fc"
            transparent
            opacity={0.6 + Math.sin(i) * 0.2}
          />
        </mesh>
      ))}
      {/* Center rune */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.08, 6]} />
        <meshBasicMaterial
          color="#e879f9"
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

// Enchanted starry ceiling with aurora effect
function EnchantedCeiling() {
  const auroraRef = useRef();
  const starsRef = useRef();

  useFrame((state) => {
    if (auroraRef.current) {
      auroraRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
    if (starsRef.current) {
      // Twinkling stars
      starsRef.current.children.forEach((star, i) => {
        star.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.3;
      });
    }
  });

  const stars = useMemo(() => {
    const starData = [];
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 2.5;
      starData.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        size: 0.005 + Math.random() * 0.01
      });
    }
    return starData;
  }, []);

  return (
    <group position={[0, 2.38, 0]}>
      {/* Aurora bands */}
      <group ref={auroraRef}>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[0, 0, 0]}
            rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}
          >
            <ringGeometry args={[0.5 + i * 0.6, 0.8 + i * 0.6, 32]} />
            <meshBasicMaterial
              color={['#8b5cf6', '#06b6d4', '#10b981'][i]}
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
      {/* Stars */}
      <group ref={starsRef}>
        {stars.map((star, i) => (
          <mesh key={i} position={[star.x, 0, star.z]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[star.size, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Crystal ball on pedestal
function CrystalBall({ position }) {
  const ballRef = useRef();
  const innerRef = useRef();

  useFrame((state) => {
    if (innerRef.current) {
      innerRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      innerRef.current.rotation.x = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Pedestal */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.3, 8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Crystal ball */}
      <mesh ref={ballRef} position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial
          color="#e0e7ff"
          transparent
          opacity={0.6}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>
      {/* Inner swirl */}
      <mesh ref={innerRef} position={[0, 0.35, 0]}>
        <torusGeometry args={[0.04, 0.01, 8, 16]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
      </mesh>
      {/* Glow */}
      <pointLight
        position={[0, 0.35, 0]}
        color="#a78bfa"
        intensity={0.3}
        distance={0.5}
        decay={2}
      />
    </group>
  );
}

// Ground mist effect
function GroundMist() {
  const mistRef = useRef();

  useFrame((state) => {
    if (mistRef.current) {
      mistRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      mistRef.current.position.y = 0.02 + Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
    }
  });

  return (
    <group ref={mistRef} position={[0, 0.02, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, (i * Math.PI * 2) / 3]}>
          <ringGeometry args={[0.3 + i * 0.5, 1 + i * 0.6, 32]} />
          <meshBasicMaterial
            color="#e879f9"
            transparent
            opacity={0.1 - i * 0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// Magical Unicorn statue
function UnicornStatue({ position, rotation = [0, 0, 0] }) {
  const hornRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (hornRef.current) {
      // Horn glows and pulses
      hornRef.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Body */}
      <mesh position={[0, 0.15, 0]}>
        <capsuleGeometry args={[0.08, 0.15, 8, 16]} />
        <meshStandardMaterial color="#f5f5ff" metalness={0.2} roughness={0.3} />
      </mesh>
      {/* Neck */}
      <mesh position={[0.05, 0.28, 0]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.04, 0.1, 8, 16]} />
        <meshStandardMaterial color="#f5f5ff" metalness={0.2} roughness={0.3} />
      </mesh>
      {/* Head */}
      <mesh position={[0.12, 0.35, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#f5f5ff" metalness={0.2} roughness={0.3} />
      </mesh>
      {/* Snout */}
      <mesh position={[0.18, 0.33, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.025, 0.04, 8, 16]} />
        <meshStandardMaterial color="#ffe4f0" metalness={0.1} roughness={0.4} />
      </mesh>
      {/* Horn - magical glowing */}
      <mesh ref={hornRef} position={[0.14, 0.42, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.015, 0.1, 8]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
      {/* Ears */}
      <mesh position={[0.08, 0.4, 0.03]} rotation={[0.3, 0, -0.3]}>
        <coneGeometry args={[0.015, 0.04, 4]} />
        <meshStandardMaterial color="#f5f5ff" />
      </mesh>
      <mesh position={[0.08, 0.4, -0.03]} rotation={[-0.3, 0, -0.3]}>
        <coneGeometry args={[0.015, 0.04, 4]} />
        <meshStandardMaterial color="#f5f5ff" />
      </mesh>
      {/* Legs */}
      {[[-0.05, 0, 0.04], [-0.05, 0, -0.04], [0.05, 0, 0.04], [0.05, 0, -0.04]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.015, 0.02, 0.12, 8]} />
          <meshStandardMaterial color="#f5f5ff" />
        </mesh>
      ))}
      {/* Magical mane - rainbow colors */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={`mane-${i}`} position={[0.02 - i * 0.02, 0.32 + i * 0.02, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial
            color={['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c084fc'][i]}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
      {/* Tail - rainbow */}
      {[0, 1, 2].map((i) => (
        <mesh key={`tail-${i}`} position={[-0.12 - i * 0.02, 0.15 - i * 0.03, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial
            color={['#ff6b6b', '#ffd93d', '#c084fc'][i]}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
      {/* Glow aura */}
      <mesh ref={glowRef} position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#e879f9" transparent opacity={0.1} />
      </mesh>
      {/* Light */}
      <pointLight position={[0.14, 0.45, 0]} color="#ffd700" intensity={0.5} distance={1} decay={2} />
    </group>
  );
}

// Rainbow arc decoration
function RainbowArc({ position, rotation = [0, 0, 0] }) {
  const colors = ['#ff6b6b', '#ffa94d', '#ffd93d', '#6bcb77', '#4d96ff', '#c084fc'];

  return (
    <group position={position} rotation={rotation}>
      {colors.map((color, i) => (
        <mesh key={i} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.4 + i * 0.03, 0.015, 8, 32, Math.PI]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// AI Opponent - Magical Wizard Character
function AIOpponent({ isThinking = false, gameStatus = 'playing', isMoving = false }) {
  const groupRef = useRef();
  const wandRef = useRef();
  const eyesRef = useRef();
  const particlesRef = useRef();
  const handRef = useRef();
  const moveTimeRef = useRef(0);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Floating bob animation - positioned to sit at table
    if (groupRef.current) {
      groupRef.current.position.y = 0.22 + Math.sin(time * 0.8) * 0.01;
    }

    // Wand glow when thinking or moving
    if (wandRef.current) {
      const baseIntensity = (isThinking || isMoving) ? 1.0 : 0.3;
      const pulse = (isThinking || isMoving) ? Math.sin(time * 5) * 0.5 : Math.sin(time) * 0.1;
      wandRef.current.material.emissiveIntensity = baseIntensity + pulse;
    }

    // Eyes glow - brighter when active
    if (eyesRef.current) {
      const eyeIntensity = (isThinking || isMoving) ? 0.8 : 0.5;
      eyesRef.current.children.forEach((eye) => {
        eye.material.emissiveIntensity = eyeIntensity + Math.sin(time * 2) * 0.2;
      });
    }

    // Hand gesture - animated based on state
    if (handRef.current) {
      if (isMoving) {
        // Moving piece - dramatic wand wave toward board
        moveTimeRef.current += 0.05;
        const wave = Math.sin(moveTimeRef.current * 3);
        handRef.current.rotation.x = -0.6 + wave * 0.3;
        handRef.current.rotation.z = -0.3 + wave * 0.2;
        handRef.current.position.y = 0.08;
        handRef.current.position.z = 0.1; // Reach toward board
      } else if (isThinking) {
        // Thinking pose - hand on chin
        moveTimeRef.current = 0;
        handRef.current.rotation.x = -0.3 + Math.sin(time * 2) * 0.1;
        handRef.current.rotation.z = -0.5;
        handRef.current.position.y = 0.2;
        handRef.current.position.z = 0.05;
      } else {
        // Relaxed position
        moveTimeRef.current = 0;
        handRef.current.rotation.x = 0.1;
        handRef.current.rotation.z = -0.5;
        handRef.current.position.y = 0.1;
        handRef.current.position.z = 0.05;
      }
    }

    // Particles more active when thinking/moving
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * ((isThinking || isMoving) ? 0.8 : 0.1);
    }
  });

  // Determine posture based on game status
  const isWinning = gameStatus === 'black_wins';
  const isLosing = gameStatus === 'white_wins';
  const bodyLean = isWinning ? -0.1 : (isLosing ? 0.15 : 0);

  return (
    <group position={[0, 0, -0.55]} rotation={[0, Math.PI, 0]} scale={2.2}>
      {/* Main body group with floating animation - SCALED UP */}
      <group ref={groupRef} position={[0, 0.22, 0]}>
        {/* Body lean based on game status */}
        <group rotation={[bodyLean, 0, 0]}>

          {/* Robe body */}
          <mesh position={[0, 0, 0]}>
            <coneGeometry args={[0.12, 0.35, 8]} />
            <meshStandardMaterial
              color="#2d1b69"
              roughness={0.8}
            />
          </mesh>

          {/* Robe trim */}
          <mesh position={[0, -0.15, 0]}>
            <torusGeometry args={[0.14, 0.02, 8, 16]} />
            <meshStandardMaterial
              color="#ffd700"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Head/Hood */}
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#1a0a3e" roughness={0.9} />
          </mesh>

          {/* Hood point */}
          <mesh position={[0, 0.35, -0.02]} rotation={[0.2, 0, 0]}>
            <coneGeometry args={[0.08, 0.15, 8]} />
            <meshStandardMaterial color="#2d1b69" roughness={0.8} />
          </mesh>

          {/* Glowing eyes */}
          <group ref={eyesRef} position={[0, 0.25, 0.07]}>
            <mesh position={[-0.03, 0, 0]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial
                color="#a78bfa"
                emissive="#a78bfa"
                emissiveIntensity={0.5}
              />
            </mesh>
            <mesh position={[0.03, 0, 0]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial
                color="#a78bfa"
                emissive="#a78bfa"
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>

          {/* Arms */}
          <mesh position={[-0.12, 0.05, 0]} rotation={[0, 0, 0.5]}>
            <capsuleGeometry args={[0.03, 0.15, 4, 8]} />
            <meshStandardMaterial color="#2d1b69" roughness={0.8} />
          </mesh>

          {/* Right arm with hand - animated */}
          <group ref={handRef} position={[0.12, 0.15, 0.05]}>
            <mesh rotation={[0, 0, -0.5]}>
              <capsuleGeometry args={[0.03, 0.15, 4, 8]} />
              <meshStandardMaterial color="#2d1b69" roughness={0.8} />
            </mesh>

            {/* Hand */}
            <mesh position={[0.08, -0.08, 0]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color="#d4a" roughness={0.6} />
            </mesh>

            {/* Wand */}
            <mesh ref={wandRef} position={[0.1, -0.1, 0]} rotation={[0.3, 0, -0.8]}>
              <cylinderGeometry args={[0.008, 0.004, 0.15, 8]} />
              <meshStandardMaterial
                color="#4a2c0a"
                emissive="#ffd700"
                emissiveIntensity={0.3}
                roughness={0.4}
              />
            </mesh>

            {/* Wand tip glow */}
            <mesh position={[0.15, -0.15, 0]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshStandardMaterial
                color="#ffd700"
                emissive="#ffd700"
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>

          {/* Magical aura particles */}
          <group ref={particlesRef}>
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const radius = 0.2;
              return (
                <mesh
                  key={i}
                  position={[
                    Math.cos(angle) * radius,
                    0.1 + (i % 3) * 0.1,
                    Math.sin(angle) * radius
                  ]}
                >
                  <sphereGeometry args={[0.008, 6, 6]} />
                  <meshBasicMaterial
                    color={isThinking ? '#ffd700' : '#a78bfa'}
                    transparent
                    opacity={0.6}
                  />
                </mesh>
              );
            })}
          </group>

          {/* Thinking indicator - extra sparkles */}
          {isThinking && (
            <group position={[0, 0.4, 0]}>
              {[...Array(5)].map((_, i) => (
                <mesh
                  key={`think-${i}`}
                  position={[
                    (Math.random() - 0.5) * 0.2,
                    Math.random() * 0.1,
                    (Math.random() - 0.5) * 0.2
                  ]}
                >
                  <sphereGeometry args={[0.01, 6, 6]} />
                  <meshBasicMaterial color="#ffd700" transparent opacity={0.8} />
                </mesh>
              ))}
            </group>
          )}
        </group>
      </group>

      {/* Ambient light from character */}
      <pointLight
        position={[0, 0.5, 0]}
        color="#a78bfa"
        intensity={isThinking ? 0.4 : 0.2}
        distance={1}
        decay={2}
      />
    </group>
  );
}

// Floating candle component with colored flames
function Candle({ position, flameColor = '#ffa500' }) {
  const lightRef = useRef();

  useFrame((state) => {
    if (lightRef.current) {
      // Flickering effect
      lightRef.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 10 + position[0] * 5) * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={position}>
        {/* Candle body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.02, 0.1, 8]} />
          <meshStandardMaterial color="#f5f5dc" />
        </mesh>
        {/* Flame */}
        <mesh position={[0, 0.07, 0]}>
          <coneGeometry args={[0.01, 0.03, 8]} />
          <meshBasicMaterial color={flameColor} />
        </mesh>
        {/* Point light */}
        <pointLight
          ref={lightRef}
          position={[0, 0.1, 0]}
          color={flameColor}
          intensity={0.5}
          distance={2}
          decay={2}
        />
      </group>
    </Float>
  );
}

// Bookshelf component
function Bookshelf({ position, rotation = [0, 0, 0] }) {
  const books = [];
  const bookColors = ['#8B4513', '#2F4F4F', '#800020', '#1a1a2e', '#4a0080'];

  for (let shelf = 0; shelf < 3; shelf++) {
    for (let i = 0; i < 8; i++) {
      const height = 0.08 + Math.random() * 0.04;
      const width = 0.02 + Math.random() * 0.02;
      books.push(
        <mesh
          key={`book-${shelf}-${i}`}
          position={[
            -0.14 + i * 0.04 + Math.random() * 0.01,
            0.1 + shelf * 0.15,
            0
          ]}
        >
          <boxGeometry args={[width, height, 0.06]} />
          <meshStandardMaterial
            color={bookColors[Math.floor(Math.random() * bookColors.length)]}
          />
        </mesh>
      );
    }
  }

  return (
    <group position={position} rotation={rotation}>
      {/* Shelf frame */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.4, 0.5, 0.1]} />
        <meshStandardMaterial color="#3d2914" />
      </mesh>
      {/* Books */}
      {books}
    </group>
  );
}

// Magical window with stars
function MagicalWindow({ position, rotation }) {
  const starsRef = useRef();

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Window frame */}
      <mesh>
        <boxGeometry args={[0.6, 0.8, 0.05]} />
        <meshStandardMaterial color="#3d2914" />
      </mesh>
      {/* Window glass - night sky */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.5, 0.7]} />
        <meshBasicMaterial color="#0a0a2e" />
      </mesh>
      {/* Stars */}
      <group ref={starsRef} position={[0, 0, 0.04]}>
        {[...Array(20)].map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 0.4,
              (Math.random() - 0.5) * 0.6,
              0
            ]}
          >
            <circleGeometry args={[0.005 + Math.random() * 0.005, 6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
      {/* Moon */}
      <mesh position={[0.1, 0.2, 0.04]}>
        <circleGeometry args={[0.05, 16]} />
        <meshBasicMaterial color="#f0f0d0" />
      </mesh>
    </group>
  );
}

// Fireplace with magical flames
function Fireplace({ position }) {
  const flameRef = useRef();

  useFrame((state) => {
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.2;
      flameRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Fireplace frame */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.5, 0.4, 0.3]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      {/* Opening */}
      <mesh position={[0, 0.15, 0.1]}>
        <boxGeometry args={[0.35, 0.25, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Magical flames */}
      <group ref={flameRef} position={[0, 0.1, 0.05]}>
        <mesh position={[-0.05, 0, 0]}>
          <coneGeometry args={[0.04, 0.15, 8]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0.05, 0, 0]}>
          <coneGeometry args={[0.05, 0.18, 8]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <coneGeometry args={[0.03, 0.12, 8]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.9} />
        </mesh>
      </group>
      {/* Fire light */}
      <pointLight
        position={[0, 0.15, 0.1]}
        color="#8b5cf6"
        intensity={1}
        distance={3}
        decay={2}
      />
    </group>
  );
}

// Magical dust particles
function MagicalParticles() {
  const particlesRef = useRef();
  const count = 50;

  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 1] = Math.random() * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += 0.002;
        if (positions[i * 3 + 1] > 2.5) {
          positions[i * 3 + 1] = 0;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.01}
        color="#ffd700"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Chess table
function ChessTable() {
  return (
    <group position={[0, 0, 0]}>
      {/* Table top */}
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.04, 0.7]} />
        <meshStandardMaterial color="#2d1b12" roughness={0.7} />
      </mesh>
      {/* Golden trim */}
      <mesh position={[0, 0.74, 0]}>
        <boxGeometry args={[0.72, 0.02, 0.72]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Table legs */}
      {[
        [-0.28, 0.37, -0.28],
        [0.28, 0.37, -0.28],
        [-0.28, 0.37, 0.28],
        [0.28, 0.37, 0.28]
      ].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.74, 8]} />
          <meshStandardMaterial color="#2d1b12" roughness={0.7} />
        </mesh>
      ))}
      {/* Magical runes on table edge */}
      <mesh position={[0, 0.76, 0.33]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 0.02]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export default function WizardStudy({ isAIThinking = false, gameStatus = 'playing', isAIMoving = false }) {
  return (
    <group>
      {/* Main directional light for shadows */}
      <directionalLight
        position={[2, 3, 1]}
        intensity={0.4}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={10}
      />

      {/* Fill light from opposite side */}
      <directionalLight
        position={[-2, 2, -1]}
        intensity={0.2}
        color="#e6e6ff"
      />

      {/* Overhead spotlight on board */}
      <spotLight
        position={[0, 2, 0]}
        angle={0.4}
        penumbra={0.5}
        intensity={0.6}
        color="#fffaf0"
        castShadow
        target-position={[0, 0.78, 0]}
      />

      {/* Rim lighting for pieces - subtle purple */}
      <pointLight
        position={[0.5, 1, 0.5]}
        intensity={0.15}
        color="#a78bfa"
        distance={2}
        decay={2}
      />
      <pointLight
        position={[-0.5, 1, -0.5]}
        intensity={0.15}
        color="#a78bfa"
        distance={2}
        decay={2}
      />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial color="#3d2914" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Decorative floor ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[1.2, 1.3, 32]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.2}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Walls - circular room with better material */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[3, 3, 2.4, 32, 1, true]} />
        <meshStandardMaterial color="#3a3a4a" side={THREE.BackSide} roughness={0.85} />
      </mesh>

      {/* Enchanted Ceiling with stars and aurora */}
      <EnchantedCeiling />

      {/* Chess Table */}
      <ChessTable />

      {/* Glowing floor runes around table */}
      <GlowingRunes />

      {/* Ground mist effect */}
      <GroundMist />

      {/* Player chair (behind player) */}
      <mesh position={[0, 0.3, 0.8]}>
        <boxGeometry args={[0.4, 0.6, 0.4]} />
        <meshStandardMaterial color="#4a0080" roughness={0.7} />
      </mesh>

      {/* AI Opponent - Magical Wizard */}
      <AIOpponent isThinking={isAIThinking} gameStatus={gameStatus} isMoving={isAIMoving} />

      {/* Floating Candles with varied magical flame colors */}
      <Candle position={[-0.8, 1.5, -0.5]} flameColor="#ffa500" />
      <Candle position={[0.8, 1.6, -0.5]} flameColor="#a78bfa" />
      <Candle position={[-0.5, 1.4, 0.8]} flameColor="#60a5fa" />
      <Candle position={[0.5, 1.7, 0.8]} flameColor="#ffa500" />
      <Candle position={[-1.2, 1.3, 0]} flameColor="#f472b6" />
      <Candle position={[1.2, 1.5, 0]} flameColor="#a78bfa" />
      <Candle position={[0, 1.8, -1]} flameColor="#fbbf24" />
      <Candle position={[-0.3, 1.4, -0.3]} flameColor="#60a5fa" />
      <Candle position={[0.3, 1.6, 0.3]} flameColor="#a78bfa" />
      <Candle position={[0.9, 1.2, -0.9]} flameColor="#f472b6" />

      {/* Floating magical crystals around the room */}
      <FloatingCrystal position={[-1.5, 1.2, -1.5]} color="#a78bfa" size={0.06} />
      <FloatingCrystal position={[1.5, 1.4, -1.5]} color="#60a5fa" size={0.08} />
      <FloatingCrystal position={[-1.5, 1.6, 1.5]} color="#f472b6" size={0.05} />
      <FloatingCrystal position={[1.5, 1.3, 1.5]} color="#fbbf24" size={0.07} />
      <FloatingCrystal position={[0, 1.9, -2]} color="#a78bfa" size={0.1} />
      <FloatingCrystal position={[-2, 1.1, 0]} color="#60a5fa" size={0.06} />
      <FloatingCrystal position={[2, 1.5, 0]} color="#f472b6" size={0.07} />

      {/* Crystal ball on side table */}
      <CrystalBall position={[-0.5, 0, -0.5]} />

      {/* Unicorn statues - magical guardians */}
      <UnicornStatue position={[-1.8, 0, -1.2]} rotation={[0, 0.5, 0]} />
      <UnicornStatue position={[1.8, 0, -1.2]} rotation={[0, -0.5, 0]} />
      <UnicornStatue position={[0, 0, -2]} rotation={[0, 0, 0]} />

      {/* Rainbow arcs */}
      <RainbowArc position={[0, 1.8, -2.5]} rotation={[0.2, 0, 0]} />
      <RainbowArc position={[-2, 1.5, 0]} rotation={[0.2, Math.PI / 2, 0]} />
      <RainbowArc position={[2, 1.5, 0]} rotation={[0.2, -Math.PI / 2, 0]} />

      {/* Bookshelves */}
      <Bookshelf position={[-2.5, 0.2, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Bookshelf position={[2.5, 0.2, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <Bookshelf position={[0, 0.2, -2.5]} rotation={[0, 0, 0]} />

      {/* Magical Window */}
      <MagicalWindow position={[0, 1.2, -2.9]} rotation={[0, 0, 0]} />

      {/* Fireplace */}
      <Fireplace position={[2.2, 0, -1.5]} />

      {/* Magical Particles */}
      <MagicalParticles />

      {/* Ambient board glow - enhanced */}
      <pointLight
        position={[0, 0.85, 0]}
        color="#8b5cf6"
        intensity={0.4}
        distance={0.8}
        decay={2}
      />

      {/* Board underlight for depth */}
      <pointLight
        position={[0, 0.7, 0]}
        color="#d4af37"
        intensity={0.15}
        distance={0.5}
        decay={2}
      />

      {/* Soft ambient hemisphere light */}
      <hemisphereLight
        color="#ffeedd"
        groundColor="#332244"
        intensity={0.3}
      />
    </group>
  );
}
