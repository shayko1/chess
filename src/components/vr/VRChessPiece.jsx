import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';

// Piece colors - enhanced for better visibility
const WHITE_COLOR = '#ffd700'; // Gold
const WHITE_SECONDARY = '#fff8dc'; // Cream
const WHITE_GLOW = '#ffeb99'; // Soft gold glow
const BLACK_COLOR = '#5a0090'; // Rich Purple
const BLACK_SECONDARY = '#3d1b5e'; // Dark purple
const BLACK_GLOW = '#a855f7'; // Purple glow

// Piece heights for proper sizing
const PIECE_SCALE = {
  king: 1.2,
  queen: 1.1,
  rook: 0.8,
  bishop: 0.9,
  knight: 0.85,
  pawn: 0.6
};

// King piece - Unicorn inspired (tall cone with sphere)
function KingGeometry({ color }) {
  const isWhite = color === 'white';
  const mainColor = isWhite ? WHITE_COLOR : BLACK_COLOR;
  const accentColor = isWhite ? WHITE_SECONDARY : BLACK_SECONDARY;

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.018, 0.02, 0.02, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.012, 0.016, 0.04, 16]} />
        <meshStandardMaterial color={mainColor} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Crown base */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.014, 0.012, 0.02, 16]} />
        <meshStandardMaterial color={mainColor} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Crown top */}
      <mesh position={[0, 0.09, 0]}>
        <sphereGeometry args={[0.008, 16, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Cross on top */}
      <mesh position={[0, 0.105, 0]}>
        <boxGeometry args={[0.003, 0.015, 0.003]} />
        <meshStandardMaterial color={mainColor} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[0.01, 0.003, 0.003]} />
        <meshStandardMaterial color={mainColor} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Queen piece - Fairy princess with wand
function QueenGeometry({ color }) {
  const isWhite = color === 'white';
  const mainColor = isWhite ? WHITE_COLOR : BLACK_COLOR;
  const accentColor = isWhite ? WHITE_SECONDARY : BLACK_SECONDARY;

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.017, 0.019, 0.02, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.01, 0.015, 0.04, 16]} />
        <meshStandardMaterial color={mainColor} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Crown */}
      <mesh position={[0, 0.065, 0]}>
        <coneGeometry args={[0.012, 0.03, 8]} />
        <meshStandardMaterial color={mainColor} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Crown jewel */}
      <mesh position={[0, 0.085, 0]}>
        <sphereGeometry args={[0.006, 16, 16]} />
        <meshStandardMaterial
          color={isWhite ? '#ff69b4' : '#9333ea'}
          emissive={isWhite ? '#ff69b4' : '#9333ea'}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// Rook piece - Castle tower
function RookGeometry({ color }) {
  const isWhite = color === 'white';
  const mainColor = isWhite ? WHITE_COLOR : BLACK_COLOR;
  const accentColor = isWhite ? WHITE_SECONDARY : BLACK_SECONDARY;

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.016, 0.018, 0.02, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Tower body */}
      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.012, 0.014, 0.05, 8]} />
        <meshStandardMaterial color={mainColor} metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Tower top */}
      <mesh position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.014, 0.012, 0.01, 8]} />
        <meshStandardMaterial color={mainColor} metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Battlements */}
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(angle) * 0.01,
            0.075,
            Math.cos(angle) * 0.01
          ]}
        >
          <boxGeometry args={[0.006, 0.01, 0.006]} />
          <meshStandardMaterial color={mainColor} metalness={0.4} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// Bishop piece - Wizard with pointed hat
function BishopGeometry({ color }) {
  const isWhite = color === 'white';
  const mainColor = isWhite ? WHITE_COLOR : BLACK_COLOR;
  const accentColor = isWhite ? WHITE_SECONDARY : BLACK_SECONDARY;

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.015, 0.017, 0.02, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.008, 0.013, 0.03, 16]} />
        <meshStandardMaterial color={mainColor} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Hat */}
      <mesh position={[0, 0.06, 0]}>
        <coneGeometry args={[0.01, 0.035, 16]} />
        <meshStandardMaterial color={mainColor} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Diagonal cut/slit */}
      <mesh position={[0, 0.055, 0.005]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.008, 0.015, 0.002]} />
        <meshStandardMaterial color={accentColor} metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  );
}

// Knight piece - Horse/Pegasus shape (simplified L-shape)
function KnightGeometry({ color }) {
  const isWhite = color === 'white';
  const mainColor = isWhite ? WHITE_COLOR : BLACK_COLOR;
  const accentColor = isWhite ? WHITE_SECONDARY : BLACK_SECONDARY;

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.015, 0.017, 0.02, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.035, 0.003]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.01, 0.03, 8]} />
        <meshStandardMaterial color={mainColor} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.055, 0.01]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.012, 0.02, 0.015]} />
        <meshStandardMaterial color={mainColor} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.055, 0.022]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.008, 0.012, 0.012]} />
        <meshStandardMaterial color={mainColor} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.005, 0.068, 0.005]}>
        <coneGeometry args={[0.003, 0.008, 4]} />
        <meshStandardMaterial color={mainColor} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0.005, 0.068, 0.005]}>
        <coneGeometry args={[0.003, 0.008, 4]} />
        <meshStandardMaterial color={mainColor} metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Pawn piece - Small sphere on cylinder
function PawnGeometry({ color }) {
  const isWhite = color === 'white';
  const mainColor = isWhite ? WHITE_COLOR : BLACK_COLOR;
  const accentColor = isWhite ? WHITE_SECONDARY : BLACK_SECONDARY;

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.008, 0]}>
        <cylinderGeometry args={[0.012, 0.014, 0.016, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.006, 0.01, 0.02, 16]} />
        <meshStandardMaterial color={mainColor} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.042, 0]}>
        <sphereGeometry args={[0.008, 16, 16]} />
        <meshStandardMaterial color={mainColor} metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Get the appropriate geometry for a piece type
function PieceGeometry({ piece }) {
  const { type, color } = piece;

  switch (type) {
    case 'king':
      return <KingGeometry color={color} />;
    case 'queen':
      return <QueenGeometry color={color} />;
    case 'rook':
      return <RookGeometry color={color} />;
    case 'bishop':
      return <BishopGeometry color={color} />;
    case 'knight':
      return <KnightGeometry color={color} />;
    case 'pawn':
      return <PawnGeometry color={color} />;
    default:
      return null;
  }
}

export default function VRChessPiece({
  piece,
  position,
  isSelected,
  onGrab,
  onDrop,
  validMoves
}) {
  const groupRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Animation for selected/hovered state
  useFrame((state) => {
    if (groupRef.current) {
      // Float WAY up when selected so it doesn't block destination squares!
      // Also move slightly toward player (positive Z) to clear the path
      const targetY = isSelected ? 0.15 : (hovered ? 0.02 : 0);
      const targetZ = isSelected ? 0.04 : 0;

      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        0.15
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        position[2] + targetZ,
        0.15
      );

      // Scale up more when hovered for easier targeting
      const targetScale = isSelected ? 1.4 : (hovered ? 1.25 : 1);
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.12)
      );
    }

    // Pulsing glow effect - more pronounced
    if (glowRef.current && (isSelected || hovered)) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.15 + 0.95;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const scale = PIECE_SCALE[piece.type] || 1;
  const isWhite = piece.color === 'white';
  const glowColor = isWhite ? WHITE_GLOW : BLACK_GLOW;

  const handleSelect = () => {
    onGrab?.();
  };

  const handleHover = () => {
    setHovered(true);
  };

  const handleBlur = () => {
    setHovered(false);
  };

  // When selected, don't block clicks - let them pass through to squares
  const interactionEnabled = !isSelected;

  return (
    <Interactive
      onSelect={interactionEnabled ? handleSelect : undefined}
      onHover={interactionEnabled ? handleHover : undefined}
      onBlur={interactionEnabled ? handleBlur : undefined}
    >
      <Float
        speed={isSelected ? 3 : 1.2}
        rotationIntensity={isSelected ? 0.3 : 0.08}
        floatIntensity={isSelected ? 0.2 : 0.05}
      >
        <group
          ref={groupRef}
          position={[position[0], position[1], position[2]]}
          scale={scale}
          onClick={interactionEnabled ? (e) => {
            e.stopPropagation();
            onGrab?.();
          } : undefined}
          onPointerEnter={interactionEnabled ? handleHover : undefined}
          onPointerLeave={interactionEnabled ? handleBlur : undefined}
        >
          {/* Hit area - only when not selected */}
          {interactionEnabled && (
            <mesh visible={false}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
          )}

          <PieceGeometry piece={piece} />

          {/* Base glow - always visible, brighter */}
          <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.022, 16]} />
            <meshBasicMaterial
              color={glowColor}
              transparent
              opacity={0.25}
            />
          </mesh>

          {/* Selection glow - large pulsing effect */}
          {isSelected && (
            <group ref={glowRef}>
              <mesh position={[0, 0.03, 0]}>
                <sphereGeometry args={[0.04, 16, 16]} />
                <meshBasicMaterial
                  color="#fbbf24"
                  transparent
                  opacity={0.5}
                />
              </mesh>
              {/* Selection ring - larger */}
              <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.025, 0.032, 16]} />
                <meshBasicMaterial
                  color="#fbbf24"
                  transparent
                  opacity={0.9}
                />
              </mesh>
              {/* Selection light - brighter */}
              <pointLight
                position={[0, 0.06, 0]}
                color="#fbbf24"
                intensity={0.5}
                distance={0.3}
                decay={2}
              />
            </group>
          )}

          {/* Hover glow - more visible */}
          {hovered && !isSelected && (
            <group ref={glowRef}>
              <mesh position={[0, 0.025, 0]}>
                <sphereGeometry args={[0.032, 16, 16]} />
                <meshBasicMaterial
                  color={glowColor}
                  transparent
                  opacity={0.35}
                />
              </mesh>
              {/* Hover ring - larger */}
              <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.022, 0.028, 16]} />
                <meshBasicMaterial
                  color={glowColor}
                  transparent
                  opacity={0.7}
                />
              </mesh>
              {/* Hover light */}
              <pointLight
                position={[0, 0.04, 0]}
                color={glowColor}
                intensity={0.2}
                distance={0.15}
                decay={2}
              />
            </group>
          )}
        </group>
      </Float>
    </Interactive>
  );
}
