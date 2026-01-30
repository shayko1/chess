import React, { useState, useCallback, useMemo } from 'react';
import { Interactive } from '@react-three/xr';
import VRChessPiece from './VRChessPiece';

const SQUARE_SIZE = 0.05; // 5cm per square
const BOARD_SIZE = SQUARE_SIZE * 8; // 40cm total
const BOARD_HEIGHT = 0.78; // Height above floor

// Classic chess board colors - HIGH CONTRAST
const LIGHT_SQUARE = '#fffef0'; // Bright white/cream
const DARK_SQUARE = '#8b5cf6';  // Bright purple
const VALID_MOVE_COLOR = '#22c55e'; // Green
const SELECTED_COLOR = '#fbbf24'; // Amber
const HOVER_LIGHT = '#ffffff';
const HOVER_DARK = '#a78bfa';

// Pre-generate stable board square data
const BOARD_SQUARES = [];
for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    // Chess board: a1 is dark, so (0,0) should check if sum is odd for dark
    const isLight = (row + col) % 2 === 1;
    const x = (col - 3.5) * SQUARE_SIZE;
    const z = (row - 3.5) * SQUARE_SIZE;
    BOARD_SQUARES.push({ row, col, isLight, position: [x, 0, z] });
  }
}

function Square({ position, color, isValidMove, isSelected, onClick, onHover, onBlur }) {
  const [hovered, setHovered] = useState(false);

  let displayColor = color;
  if (isSelected) displayColor = SELECTED_COLOR;
  else if (isValidMove) displayColor = VALID_MOVE_COLOR;
  else if (hovered) displayColor = color === LIGHT_SQUARE ? HOVER_LIGHT : HOVER_DARK;

  const handleHover = () => {
    setHovered(true);
    onHover?.();
  };

  const handleBlur = () => {
    setHovered(false);
    onBlur?.();
  };

  return (
    <Interactive
      onSelect={onClick}
      onHover={handleHover}
      onBlur={handleBlur}
    >
      <group position={position}>
        {/* Larger invisible hit area for easier selection when seated */}
        <mesh
          position={[0, 0.015, 0]}
          onClick={onClick}
          onPointerEnter={handleHover}
          onPointerLeave={handleBlur}
          visible={false}
        >
          <boxGeometry args={[SQUARE_SIZE * 1.2, 0.03, SQUARE_SIZE * 1.2]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Square as 3D tile for visibility */}
        <mesh position={[0, 0.002, 0]}>
          <boxGeometry args={[SQUARE_SIZE * 0.98, 0.004, SQUARE_SIZE * 0.98]} />
          <meshStandardMaterial
            color={displayColor}
            roughness={0.3}
            metalness={0.1}
            emissive={isValidMove ? '#22c55e' : (isSelected ? '#fbbf24' : displayColor)}
            emissiveIntensity={isValidMove ? 0.6 : (isSelected ? 0.5 : 0.08)}
          />
        </mesh>

        {/* Hover glow effect - brighter */}
        {hovered && (
          <mesh position={[0, 0.006, 0]}>
            <boxGeometry args={[SQUARE_SIZE * 1.05, 0.003, SQUARE_SIZE * 1.05]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
          </mesh>
        )}

        {/* Valid move indicator - larger pulsing glow */}
        {isValidMove && !isSelected && (
          <group>
            {/* Center dot */}
            <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.015, 16]} />
              <meshBasicMaterial color="#22c55e" />
            </mesh>
            {/* Outer ring glow */}
            <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.018, 0.024, 16]} />
              <meshBasicMaterial color="#22c55e" transparent opacity={0.7} />
            </mesh>
            {/* Full square subtle glow */}
            <mesh position={[0, 0.005, 0]}>
              <boxGeometry args={[SQUARE_SIZE * 0.9, 0.001, SQUARE_SIZE * 0.9]} />
              <meshBasicMaterial color="#22c55e" transparent opacity={0.2} />
            </mesh>
          </group>
        )}
      </group>
    </Interactive>
  );
}

export default function VRChessBoard({ gameState }) {
  const {
    board,
    currentTurn,
    selectedPiece,
    validMoves,
    selectPiece,
    makeMove,
    clearSelection,
    gameStatus
  } = gameState;

  // Handle square click
  const handleSquareClick = useCallback((row, col) => {
    if (gameStatus !== 'playing') return;
    if (currentTurn === 'black') return; // AI's turn

    const piece = board[row][col];

    // If we have a selected piece and clicked on valid move
    if (selectedPiece && validMoves.some(m => m.row === row && m.col === col)) {
      makeMove(selectedPiece.row, selectedPiece.col, row, col);
      return;
    }

    // If clicking on own piece, select it
    if (piece && piece.color === currentTurn) {
      selectPiece(row, col);
      return;
    }

    // Otherwise clear selection
    clearSelection();
  }, [board, currentTurn, selectedPiece, validMoves, selectPiece, makeMove, clearSelection, gameStatus]);

  // Handle piece grab
  const handlePieceGrab = useCallback((row, col) => {
    if (gameStatus !== 'playing') return;
    if (currentTurn === 'black') return;

    const piece = board[row][col];
    if (piece && piece.color === currentTurn) {
      selectPiece(row, col);
    }
  }, [board, currentTurn, selectPiece, gameStatus]);

  // Handle piece drop
  const handlePieceDrop = useCallback((fromRow, fromCol, toRow, toCol) => {
    if (selectedPiece && validMoves.some(m => m.row === toRow && m.col === toCol)) {
      makeMove(fromRow, fromCol, toRow, toCol);
      return true;
    }
    clearSelection();
    return false;
  }, [selectedPiece, validMoves, makeMove, clearSelection]);

  // Convert board coordinates to 3D position
  const boardToPosition = (row, col) => {
    const x = (col - 3.5) * SQUARE_SIZE;
    const z = (row - 3.5) * SQUARE_SIZE;
    return [x, 0, z];
  };

  return (
    <group position={[0, BOARD_HEIGHT, 0]}>
      {/* Board base with polished wood effect */}
      <mesh position={[0, -0.015, 0]}>
        <boxGeometry args={[BOARD_SIZE + 0.04, 0.03, BOARD_SIZE + 0.04]} />
        <meshStandardMaterial
          color="#1a0f08"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Board frame/border - polished wood */}
      <mesh position={[0, -0.005, 0]}>
        <boxGeometry args={[BOARD_SIZE + 0.025, 0.015, BOARD_SIZE + 0.025]} />
        <meshStandardMaterial
          color="#3d2517"
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* Inner gold trim */}
      <mesh position={[0, 0.001, 0]}>
        <boxGeometry args={[BOARD_SIZE + 0.008, 0.003, BOARD_SIZE + 0.008]} />
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Board edge glow - magical effect */}
      <mesh position={[0, -0.002, 0]}>
        <boxGeometry args={[BOARD_SIZE + 0.05, 0.008, BOARD_SIZE + 0.05]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.4}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Subtle under-glow for depth */}
      <pointLight
        position={[0, -0.02, 0]}
        color="#8b5cf6"
        intensity={0.2}
        distance={0.5}
        decay={2}
      />

      {/* Squares - using stable pre-generated data */}
      {BOARD_SQUARES.map(({ row, col, isLight, position }) => {
        const isSelectedSquare = selectedPiece?.row === row && selectedPiece?.col === col;
        const isValidMoveSquare = validMoves.some(m => m.row === row && m.col === col);

        return (
          <Square
            key={`square-${row}-${col}`}
            position={position}
            color={isLight ? LIGHT_SQUARE : DARK_SQUARE}
            isValidMove={isValidMoveSquare}
            isSelected={isSelectedSquare}
            onClick={() => handleSquareClick(row, col)}
          />
        );
      })}

      {/* Pieces */}
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          if (!piece) return null;

          const pos = boardToPosition(rowIndex, colIndex);
          const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;

          return (
            <VRChessPiece
              key={`piece-${rowIndex}-${colIndex}-${piece.type}-${piece.color}`}
              piece={piece}
              position={pos}
              isSelected={isSelected}
              onGrab={() => handlePieceGrab(rowIndex, colIndex)}
              onDrop={(toRow, toCol) => handlePieceDrop(rowIndex, colIndex, toRow, toCol)}
              boardToPosition={boardToPosition}
              validMoves={isSelected ? validMoves : []}
            />
          );
        })
      )}

      {/* Corner crystals */}
      {[
        [-BOARD_SIZE / 2 - 0.02, 0.02, -BOARD_SIZE / 2 - 0.02],
        [BOARD_SIZE / 2 + 0.02, 0.02, -BOARD_SIZE / 2 - 0.02],
        [-BOARD_SIZE / 2 - 0.02, 0.02, BOARD_SIZE / 2 + 0.02],
        [BOARD_SIZE / 2 + 0.02, 0.02, BOARD_SIZE / 2 + 0.02]
      ].map((pos, i) => (
        <mesh key={`crystal-${i}`} position={pos}>
          <octahedronGeometry args={[0.015]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#8b5cf6"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Export helper for converting 3D position to board coordinates
export const positionToBoard = (x, z) => {
  const col = Math.round(x / SQUARE_SIZE + 3.5);
  const row = Math.round(z / SQUARE_SIZE + 3.5);
  if (row >= 0 && row < 8 && col >= 0 && col < 8) {
    return { row, col };
  }
  return null;
};

export { SQUARE_SIZE, BOARD_HEIGHT };
