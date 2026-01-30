import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useController, Hands, Controllers } from '@react-three/xr';

// Controller ray visual
function ControllerRay({ inputSource }) {
  const ref = useRef();

  useFrame(() => {
    if (ref.current && inputSource) {
      // Ray follows controller direction
    }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.005, 0.005, 0.3]} />
      <meshBasicMaterial color="#8b5cf6" transparent opacity={0.5} />
    </mesh>
  );
}

export default function HandController({ gameState }) {
  // Use the available XR hooks
  const leftController = useController('left');
  const rightController = useController('right');

  return (
    <group>
      {/* Render hand models when available */}
      <Hands />

      {/* Render controller models as fallback */}
      <Controllers
        rayMaterial={{ color: '#8b5cf6', transparent: true, opacity: 0.5 }}
      />

      {/* Custom controller visuals can be added here */}
      {rightController && (
        <group>
          {/* Controller pointer indicator */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshBasicMaterial color="#ffd700" />
          </mesh>
        </group>
      )}
    </group>
  );
}
