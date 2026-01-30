import React, { useEffect, useState, Suspense, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { XR, VRButton, ARButton, Controllers, Hands, useXR } from '@react-three/xr';
import { OrbitControls } from '@react-three/drei';
import { useChessGame } from '@/hooks/useChessGame';
import WizardStudy from './WizardStudy';
import VRChessBoard from './VRChessBoard';

// Loading fallback
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color="purple" />
    </mesh>
  );
}

// VR Scene with proper player offset
// In WebXR, we can't move the camera - instead we move the world
// Player starts at origin (0,0,0), so we offset the scene to put player at white side
function VRScene({ gameState, isAIMoving }) {
  const { isPresenting } = useXR();

  // When in VR, offset the entire scene so player appears at white side of board
  // Player is at (0, ~1.6 standing height, 0) in real world
  // We want player at (0, 1.2, 0.7) relative to board
  // So we move the world by (0, 0.4, -0.7) - moving world back puts player forward
  const sceneOffset = isPresenting ? [0, -0.4, -0.7] : [0, 0, 0];

  return (
    <group position={sceneOffset}>
      {/* Base ambient light */}
      <ambientLight intensity={0.4} color="#fff5ff" />

      {/* Environment with AI state */}
      <Suspense fallback={<LoadingFallback />}>
        <WizardStudy
          isAIThinking={gameState.isAIThinking}
          gameStatus={gameState.gameStatus}
          isAIMoving={isAIMoving}
        />
      </Suspense>

      {/* Chess Board */}
      <Suspense fallback={<LoadingFallback />}>
        <VRChessBoard gameState={gameState} />
      </Suspense>

      {/* VR Controllers and Hands with ray visibility */}
      <Controllers rayMaterial={{ color: '#a78bfa' }} />
      <Hands />
    </group>
  );
}

export default function VRChessGame() {
  const [isAIMoving, setIsAIMoving] = useState(false);

  const gameState = useChessGame({
    playAgainstAI: true,
    aiLevel: 'medium',
    onGameEnd: (winner) => {
      console.log('Game ended:', winner);
    }
  });

  // Trigger AI move when it's black's turn
  useEffect(() => {
    if (gameState.currentTurn === 'black' && gameState.gameStatus === 'playing') {
      const timer = setTimeout(() => {
        // Animate the wizard making the move
        setIsAIMoving(true);

        // After animation starts, make the actual move
        setTimeout(() => {
          gameState.makeAIMove();
          // Keep the animation going briefly after move completes
          setTimeout(() => {
            setIsAIMoving(false);
          }, 500);
        }, 800);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentTurn, gameState.gameStatus]);

  return (
    <div className="w-full h-screen bg-slate-900 relative">
      {/* VR/AR Buttons - Outside Canvas */}
      <VRButton className="absolute top-4 left-4 z-50 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg cursor-pointer" />
      <ARButton className="absolute top-4 left-36 z-50 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg cursor-pointer" />

      {/* Game Status */}
      <div className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg">
        <div className="text-sm font-medium text-slate-600">
          Turn: {gameState.currentTurn === 'white' ? 'White' : 'Black'}
          {gameState.isAIThinking && ' (AI thinking...)'}
        </div>
        {gameState.gameStatus !== 'playing' && (
          <div className="text-lg font-bold text-purple-600">
            {gameState.gameStatus === 'white_wins' && 'White Wins!'}
            {gameState.gameStatus === 'black_wins' && 'Black Wins!'}
            {gameState.gameStatus === 'draw' && 'Draw!'}
          </div>
        )}
      </div>

      {/* Reset button */}
      <button
        onClick={() => gameState.resetGame()}
        className="absolute bottom-4 left-4 z-50 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg shadow-lg"
      >
        Reset Game
      </button>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 z-50 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
        <p>Click pieces to select, click squares to move</p>
        <p>Drag mouse to orbit camera</p>
        <p>Use VR button with headset</p>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.2, 0.8], fov: 60 }}
        style={{ position: 'absolute', top: 0, left: 0 }}
        shadows
        gl={{ antialias: true }}
      >
        <XR>
          <Suspense fallback={<LoadingFallback />}>
            <VRScene gameState={gameState} isAIMoving={isAIMoving} />
          </Suspense>

          {/* Orbit controls for non-VR testing */}
          <OrbitControls
            target={[0, 0.78, 0]}
            minDistance={0.3}
            maxDistance={2}
            maxPolarAngle={Math.PI / 2}
          />
        </XR>
      </Canvas>
    </div>
  );
}
