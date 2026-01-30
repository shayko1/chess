# VR Chess - Magical Academy Design

## Overview

Transform the existing 2D Magical Chess Academy into an immersive WebXR VR experience where players use hand tracking to physically grab and move chess pieces in a wizard's study environment.

## Key Decisions

- **Platform:** WebXR (browser-based, works with Quest and other WebXR headsets)
- **Interaction:** Hand tracking with pinch-to-grab gestures
- **Environment:** Magical wizard's study with floating candles and bookshelves
- **Pieces:** 3D magical creatures matching the existing emoji theme
- **Multiplayer:** Solo vs AI only (Phase 1), multiplayer later

## Architecture

```
Your App
├── 2D Mode (existing)
│   └── Current React chess game
│
└── VR Mode (new)
    ├── VRChessScene (React-Three-Fiber)
    │   ├── WizardStudyEnvironment
    │   │   ├── Room geometry
    │   │   ├── Floating candles (animated)
    │   │   ├── Bookshelves with magical books
    │   │   └── Ambient particles/magic effects
    │   │
    │   ├── ChessTable
    │   │   ├── Ornate magical table
    │   │   └── ChessBoard (8x8 glowing tiles)
    │   │
    │   └── MagicalPieces (3D models)
    │       ├── White: Unicorn, Princess, Castle, Fairy, Pegasus, Flower
    │       └── Black: Dragon, Elf Queen, Tower, Wizard, Eagle, Crystal
    │
    └── Hand Tracking
        ├── Grab detection (pinch gesture)
        ├── Piece highlighting on hover
        └── Valid move indicators
```

## Hand Interaction System

### Hover Detection
- Hand approaches piece → piece glows and floats up slightly
- Magical sparkles appear around it
- Soft chime sound plays

### Grabbing (Pinch Gesture)
- Pinch thumb and index finger near piece → piece attaches to hand
- Valid destination squares light up in green with magical rings
- Invalid squares stay dim

### Placing
- Move hand over valid square and release pinch → piece floats down into position
- Capture animation: captured piece dissolves into magical particles
- Board updates, AI starts thinking

### Feedback & Polish
- Haptic vibration on grab/release (if controllers used as fallback)
- Pieces have slight weight feel - follow hand with tiny delay
- Hands rendered as magical glowing outlines

### Invalid Move Handling
- Place on invalid square → piece gently floats back to original position
- Soft "not allowed" sound and red shimmer

## Wizard's Study Environment

### Room Layout
- Medium-sized circular stone room with arched ceiling
- Player sits in comfortable magical chair at one side of chess table
- Opponent side has empty enchanted chair (AI's seat)

### Atmospheric Elements
- **Floating candles** - 10-15 candles at different heights, flickering flames
- **Bookshelves** - Curved along walls, old spell books, some glow faintly
- **Magical window** - Starry night sky with occasional shooting stars
- **Fireplace** - Crackling fire with purple/blue magical flames
- **Ambient particles** - Tiny golden dust motes floating through air

### Lighting
- Warm candlelight as main source
- Soft blue moonlight from window
- Chess board has subtle glow from below

### Sound Design
- Gentle crackling fire ambience
- Soft magical hum
- Occasional distant owl hoot or page turning
- Musical notes when pieces move

### Chess Table
- Dark ornate wood with golden inlays and magical runes
- Board tiles alternate between deep purple and cream marble
- Edges have softly glowing crystals

## 3D Chess Pieces

### White Army (Light/Nature Magic)

| Piece  | 3D Model              | Size        | Special Effect           |
|--------|-----------------------|-------------|--------------------------|
| King   | Unicorn standing proud | Tallest     | Rainbow mane shimmer     |
| Queen  | Fairy princess w/wand  | Tall        | Floating sparkle trail   |
| Rook   | Crystal castle tower   | Medium-tall | Rotating magical rings   |
| Bishop | Fairy godmother        | Medium      | Glowing wings            |
| Knight | Pegasus (winged horse) | Medium      | Wings flutter on move    |
| Pawn   | Small flower sprite    | Short       | Petals sway gently       |

### Black Army (Shadow/Dragon Magic)

| Piece  | 3D Model            | Size        | Special Effect            |
|--------|---------------------|-------------|---------------------------|
| King   | Dragon with crown   | Tallest     | Smoke wisps from nostrils |
| Queen  | Elf sorceress       | Tall        | Shadow aura               |
| Rook   | Dark stone tower    | Medium-tall | Floating runes            |
| Bishop | Wizard with staff   | Medium      | Staff crystal glows       |
| Knight | Eagle/Griffin       | Medium      | Feathers ruffle           |
| Pawn   | Floating crystal orb | Short      | Inner glow pulses         |

### Piece Behaviors
- Idle animation: gentle breathing/hovering
- When grabbed: excited wiggle
- When capturing: victory pose before opponent dissolves

## Technical Implementation

### New Dependencies
```
@react-three/fiber    - React renderer for Three.js
@react-three/xr       - WebXR + hand tracking for React
@react-three/drei     - Useful 3D helpers (lighting, controls, etc.)
```

### File Structure
```
src/
├── components/
│   ├── chess/          (existing)
│   └── vr/             (new)
│       ├── VRChessGame.jsx      - Main VR scene wrapper
│       ├── WizardStudy.jsx      - Environment/room
│       ├── VRChessBoard.jsx     - Board + squares
│       ├── VRChessPiece.jsx     - Individual 3D piece
│       ├── HandController.jsx   - Hand tracking logic
│       └── VRGameUI.jsx         - In-VR menus (exit, settings)
│
├── hooks/
│   └── useChessGame.js          - Shared game logic (2D and VR)
│
├── assets/
│   └── models/                  - 3D models (.glb files)
│       ├── pieces/
│       └── environment/
│
└── pages/
    ├── Chess.jsx        (existing 2D game)
    └── VRChess.jsx      (new VR entry point)
```

### Entry Flow
1. User clicks "Play in VR" button on home page
2. Browser requests VR permissions
3. VR session starts, user is in wizard's study
4. Game begins, same Stockfish AI handles opponent moves

## Phases

### Phase 1 - MVP
- Basic wizard study room (simple geometry, few candles, basic lighting)
- Chess board with working squares
- Simple low-poly pieces (basic shapes initially)
- Hand tracking: grab, move, release pieces
- Valid move highlighting
- Integration with existing Stockfish AI
- "Enter VR" button from main menu

### Phase 2 - Polish
- Detailed 3D creature models
- Particle effects and magic sparkles
- Sound design
- Capture animations
- Check/checkmate visual alerts in VR

### Phase 3 - Features
- Multiplayer face-to-face VR
- Different environment themes
- Move history floating panel
- Tutorial mode in VR

## Constraints & Notes

- **3D Models:** Start with free/simple assets from Sketchfab, Poly Pizza, or procedural shapes
- **Performance:** WebXR needs 72+ FPS - keep geometry simple, optimize as needed
- **Testing:** Requires Quest headset (or similar). Can preview in browser without VR.
