# VR Chess Improvements Prompt

## Current Issues to Fix

### Issue 1: Cannot Touch and Move Pieces in VR
The hand tracking/controller interaction is not working properly. Users cannot:
- Grab pieces with pinch gesture
- Move pieces by pointing with controllers
- Get visual feedback when hovering over pieces

### Issue 2: Board Rendering Quality
The board doesn't look good and needs visual improvements:
- Better materials and textures
- Improved lighting
- More polished appearance

## Technical Context

- **Location:** `/Users/shayk/Workspace/chess`
- **VR Components:** `src/components/vr/`
- **Package:** `@react-three/xr@5.7.1`
- **Available APIs:** `Controllers`, `Hands`, `useController`, `useXR`, `Interactive`, `useInteraction`

## Implementation Requirements

### Part 1: Fix VR Interaction (Hand/Controller Grabbing)

Use the `Interactive` component from `@react-three/xr` to make pieces grabbable:

```jsx
import { Interactive } from '@react-three/xr'

// Wrap each piece in Interactive
<Interactive
  onSelect={() => handlePieceSelect(row, col)}
  onHover={() => setHoveredPiece({ row, col })}
  onBlur={() => setHoveredPiece(null)}
>
  <VRChessPiece ... />
</Interactive>
```

**Required changes to `VRChessBoard.jsx`:**
1. Import `Interactive` from `@react-three/xr`
2. Wrap each piece in `Interactive` component
3. Handle `onSelect` for piece selection and movement
4. Handle `onHover`/`onBlur` for visual feedback
5. Make squares also interactive for placing pieces

**Interaction flow:**
1. User points at piece → piece highlights (hover)
2. User selects (trigger/pinch) → piece is selected, valid moves shown
3. User points at valid square → square highlights
4. User selects valid square → piece moves there

### Part 2: Improve Board Rendering

**Board improvements:**
1. Add subtle reflections to board surface
2. Use better materials with proper roughness/metalness
3. Add edge bevels to squares
4. Improve board frame appearance
5. Add subtle ambient occlusion effect

**Piece improvements:**
1. Better materials with proper PBR settings
2. Add subtle glow effect to pieces
3. Improve hover/selection visual feedback
4. Smoother animations

**Lighting improvements:**
1. Add soft shadows
2. Better ambient lighting
3. Rim lighting for pieces
4. Board underlight effect

### Part 3: Testing

After making changes:
1. Run `npm run build` to verify no errors
2. Test in browser with OrbitControls (mouse click should work)
3. Verify pieces can be selected and moved
4. Check visual quality improvements

## File Changes Required

### `src/components/vr/VRChessBoard.jsx`
- Add Interactive wrappers for pieces and squares
- Improve interaction logic
- Better materials

### `src/components/vr/VRChessPiece.jsx`
- Better materials and visual effects
- Improved hover/selection states
- Add glow effects

### `src/components/vr/VRChessGame.jsx`
- Ensure Controllers and Hands are properly configured
- Add raycast interaction support

### `src/components/vr/WizardStudy.jsx`
- Improve lighting setup
- Add shadows

## Success Criteria

1. ✅ Can point at pieces with VR controller and see hover effect
2. ✅ Can select pieces with trigger button
3. ✅ Valid moves highlight when piece is selected
4. ✅ Can select destination square to move piece
5. ✅ Board looks polished with good materials
6. ✅ Pieces have subtle glow and good visual feedback
7. ✅ Build passes with no errors
8. ✅ Game is playable in browser (click to test) and VR
