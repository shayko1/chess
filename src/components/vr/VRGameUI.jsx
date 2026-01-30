import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

// Turn indicator that floats above the board
function TurnIndicator({ currentTurn, isAIThinking }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  const color = currentTurn === 'white' ? '#ffd700' : '#8b5cf6';
  const text = isAIThinking ? 'AI Thinking...' : `${currentTurn === 'white' ? 'White' : 'Black'}'s Turn`;

  return (
    <group ref={ref} position={[0, 1.2, 0]}>
      {/* Background panel */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[0.25, 0.06]} />
        <meshBasicMaterial color="#1a1a2e" transparent opacity={0.85} />
      </mesh>

      {/* Border glow */}
      <mesh position={[0, 0, -0.015]}>
        <planeGeometry args={[0.26, 0.07]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>

      {/* Turn text */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.025}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {text}
      </Text>

      {/* Turn icon */}
      <mesh position={[-0.1, 0, 0]}>
        <circleGeometry args={[0.012, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// Game status display (checkmate, etc.)
function GameStatus({ status, onReset }) {
  if (status === 'playing') return null;

  let message = '';
  let color = '#22c55e';

  switch (status) {
    case 'white_wins':
      message = 'White Wins!';
      color = '#ffd700';
      break;
    case 'black_wins':
      message = 'Black Wins!';
      color = '#8b5cf6';
      break;
    case 'draw':
      message = 'Draw!';
      color = '#94a3b8';
      break;
  }

  return (
    <group position={[0, 1.4, 0]}>
      {/* Background panel */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[0.35, 0.12]} />
        <meshBasicMaterial color="#1a1a2e" transparent opacity={0.95} />
      </mesh>

      {/* Border */}
      <mesh position={[0, 0, -0.015]}>
        <planeGeometry args={[0.36, 0.13]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>

      {/* Victory text */}
      <Text
        position={[0, 0.02, 0]}
        fontSize={0.035}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {message}
      </Text>

      {/* Play again hint */}
      <Text
        position={[0, -0.025, 0]}
        fontSize={0.015}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        Click to play again
      </Text>
    </group>
  );
}

// Check indicator
function CheckIndicator({ checkInfo }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
    }
  });

  if (!checkInfo) return null;

  return (
    <group position={[0, 1.1, 0]}>
      <mesh ref={ref}>
        <planeGeometry args={[0.12, 0.04]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.8} />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.02}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        CHECK!
      </Text>
    </group>
  );
}

// Move history display (last few moves)
function MoveHistory({ moves }) {
  const lastMoves = moves.slice(-3);

  if (lastMoves.length === 0) return null;

  return (
    <group position={[-0.4, 1, 0]} rotation={[0, Math.PI / 6, 0]}>
      {/* Background panel */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[0.15, 0.12]} />
        <meshBasicMaterial color="#1a1a2e" transparent opacity={0.7} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 0.04, 0]}
        fontSize={0.012}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        Recent Moves
      </Text>

      {/* Moves */}
      {lastMoves.map((move, i) => {
        const fromCol = String.fromCharCode(97 + move.from.col);
        const fromRow = 8 - move.from.row;
        const toCol = String.fromCharCode(97 + move.to.col);
        const toRow = 8 - move.to.row;
        const notation = `${move.piece.type[0].toUpperCase()}${fromCol}${fromRow}-${toCol}${toRow}`;

        return (
          <Text
            key={i}
            position={[0, 0.015 - i * 0.025, 0]}
            fontSize={0.01}
            color={move.turn === 'white' ? '#ffd700' : '#a78bfa'}
            anchorX="center"
            anchorY="middle"
          >
            {notation}
          </Text>
        );
      })}
    </group>
  );
}

export default function VRGameUI({ gameState }) {
  const {
    currentTurn,
    gameStatus,
    checkInfo,
    moveHistory,
    isAIThinking,
    resetGame
  } = gameState;

  return (
    <group>
      <TurnIndicator currentTurn={currentTurn} isAIThinking={isAIThinking} />
      <CheckIndicator checkInfo={checkInfo} />
      <GameStatus status={gameStatus} onReset={resetGame} />
      <MoveHistory moves={moveHistory} />
    </group>
  );
}
