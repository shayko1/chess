# VR Chess Implementation Prompt

## Goal

Build a WebXR VR mode for the existing Magical Chess Academy React app. Players should be able to put on a VR headset, enter a wizard's study, and play chess against the AI by physically grabbing and moving 3D magical creature pieces using hand tracking.

## Current Project State

- **Stack:** React + Vite + Tailwind + Framer Motion
- **Location:** `/Users/shayk/Workspace/chess`
- **Existing:** 2D chess game with Stockfish AI integration at `src/lib/stockfish.js`
- **Three.js:** Already installed in package.json
- **Theme:** Hebrew "Magical Chess Academy" for kids with emoji pieces (unicorns, dragons, wizards, etc.)

## Technical Requirements

### Dependencies to Install

```bash
npm install @react-three/fiber @react-three/xr @react-three/drei
```

### File Structure to Create

```
src/
├── components/vr/
│   ├── VRChessGame.jsx      # Main VR scene - wraps everything in Canvas + XR
│   ├── WizardStudy.jsx      # Environment: room, candles, bookshelves, lighting
│   ├── VRChessBoard.jsx     # The 8x8 board with interactive squares
│   ├── VRChessPiece.jsx     # Individual 3D piece with grab interaction
│   ├── HandController.jsx   # Hand tracking + pinch gesture detection
│   └── VRGameUI.jsx         # In-VR floating UI (exit button, turn indicator)
│
├── hooks/
│   └── useChessGame.js      # Extract chess logic to share between 2D and VR
│
└── pages/
    └── VRChess.jsx          # New page route for VR mode
```

## Implementation Steps

### Step 1: Set Up Basic VR Scene

Create `src/components/vr/VRChessGame.jsx`:

```jsx
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'

const store = createXRStore()

export default function VRChessGame() {
  return (
    <>
      <button onClick={() => store.enterVR()}>Enter VR</button>
      <Canvas>
        <XR store={store}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {/* Add components here */}
        </XR>
      </Canvas>
    </>
  )
}
```

### Step 2: Create the Wizard Study Environment

`src/components/vr/WizardStudy.jsx` should include:

1. **Room geometry:**
   - Circular room ~6m diameter
   - Stone walls (use `meshStandardMaterial` with gray color)
   - Arched ceiling
   - Wooden floor

2. **Chess table:**
   - Position at center, height ~0.75m
   - Dark wood material with golden trim
   - Player sits at -Z side, AI at +Z side

3. **Atmosphere:**
   - 10-15 floating candles using `<Float>` from drei
   - Simple candle: cylinder + pointLight with orange color
   - Bookshelves along walls (can be simple box geometry with texture)
   - Window showing starry sky (plane with emissive star texture or shader)

4. **Lighting:**
   - Multiple point lights from candles (low intensity, warm color)
   - Ambient light (very low, bluish)
   - Subtle glow under chess board

### Step 3: Build the Chess Board

`src/components/vr/VRChessBoard.jsx`:

1. **Board base:**
   - 8x8 grid of squares
   - Each square ~0.05m (5cm) for comfortable piece grabbing
   - Total board ~0.4m x 0.4m
   - Alternate colors: deep purple (#4a1a6b) and cream (#f5f5dc)

2. **Square interaction:**
   - Track which squares are valid moves for selected piece
   - Valid squares glow green when piece is grabbed
   - Highlight square when hand hovers over it

3. **Board position:**
   - Sits on table, angled slightly toward player
   - Center at y=0.8m (table height + board thickness)

### Step 4: Create 3D Chess Pieces

`src/components/vr/VRChessPiece.jsx`:

**For MVP, use simple geometric shapes:**

| Piece  | White Shape              | Black Shape              |
|--------|--------------------------|--------------------------|
| King   | Tall cone + sphere top   | Tall cone + sphere top   |
| Queen  | Medium cone + star top   | Medium cone + star top   |
| Rook   | Cylinder with notches    | Cylinder with notches    |
| Bishop | Cone with diagonal cut   | Cone with diagonal cut   |
| Knight | L-shaped geometry        | L-shaped geometry        |
| Pawn   | Small sphere on cylinder | Small sphere on cylinder |

**Colors:**
- White pieces: Golden/cream (#ffd700, #fff8dc)
- Black pieces: Purple/dark (#4a0080, #2d1b4e)

**Piece behaviors:**
- Idle: Gentle float animation using `<Float>` from drei
- Hover: Scale up 1.1x, emit soft glow
- Grabbed: Attach to hand position, show valid moves
- Placed: Animate down to square

### Step 5: Implement Hand Tracking

`src/components/vr/HandController.jsx`:

Use `@react-three/xr` hand tracking:

```jsx
import { useXRInputSourceState } from '@react-three/xr'

function Hands() {
  const leftHand = useXRInputSourceState('hand', 'left')
  const rightHand = useXRInputSourceState('hand', 'right')

  // Detect pinch: thumb tip close to index tip
  // When pinching near a piece, grab it
  // When releasing over valid square, place it
}
```

**Grab logic:**
1. Check distance from index fingertip to each piece
2. If distance < 0.05m and pinch detected → grab piece
3. While grabbed, piece follows hand with slight smoothing
4. On release, find nearest valid square or return to origin

### Step 6: Integrate Chess Logic

Extract existing chess logic into `src/hooks/useChessGame.js`:

```jsx
export function useChessGame() {
  const [board, setBoard] = useState(initialBoard)
  const [turn, setTurn] = useState('white')
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [validMoves, setValidMoves] = useState([])

  // Functions:
  // - getValidMoves(piece, position)
  // - makeMove(from, to)
  // - handleAIMove() - calls Stockfish
  // - isCheck(), isCheckmate()

  return { board, turn, validMoves, makeMove, ... }
}
```

This hook should work for both 2D and VR modes.

### Step 7: Add VR Page Route

Create `src/pages/VRChess.jsx`:

```jsx
import VRChessGame from '@/components/vr/VRChessGame'

export default function VRChess() {
  return (
    <div className="w-full h-screen">
      <VRChessGame />
    </div>
  )
}
```

Add to router in `src/App.jsx` or pages config.

### Step 8: Add "Enter VR" Button to Home Page

On the existing home page, add a button that links to `/vr-chess`:

```jsx
<Link to="/vr-chess">
  <Button>
    <Headset className="w-6 h-6 mr-2" />
    Play in VR
  </Button>
</Link>
```

## Chess Piece Positions

Standard chess starting position. Board coordinates:
- Files: a-h (left to right from white's view)
- Ranks: 1-8 (bottom to top from white's view)
- White pieces start on ranks 1-2
- Black pieces start on ranks 7-8

In 3D space (player at -Z looking at +Z):
- a1 is at local position (-0.175, 0, -0.175)
- h8 is at local position (0.175, 0, 0.175)
- Each square is 0.05m

## Visual Polish (After MVP Works)

1. **Particle effects:** Add sparkles using drei's `<Sparkles>`
2. **Piece glow:** Use `<Bloom>` post-processing for magical glow
3. **Shadows:** Enable shadows on pieces and table
4. **Sound:** Add spatial audio for moves, captures, ambience
5. **Animations:** Smooth piece movement with spring physics

## Testing

1. **Browser preview:** The scene should be visible in regular browser (use OrbitControls for testing)
2. **VR testing:** Use Meta Quest browser, navigate to localhost (need to be on same network)
3. **Hand tracking:** Enable in Quest settings, test pinch gestures

## Important Notes

- Keep geometry simple for 72+ FPS in VR
- Test frequently on actual headset
- The existing Stockfish integration should work as-is for AI moves
- Hebrew RTL text in VR UI needs special handling (use texture or keep minimal)

## Success Criteria

1. ✅ Can enter VR from browser
2. ✅ See wizard study environment with table and board
3. ✅ All 32 pieces visible in starting position
4. ✅ Can grab pieces with hand pinch gesture
5. ✅ Valid moves highlight when holding piece
6. ✅ Can place piece on valid square
7. ✅ AI responds with move after player moves
8. ✅ Game detects checkmate/stalemate
