# VR Chess Critical Fixes - Character Size & Piece Movement

## Critical Issues

### Issue 1: AI Character Too Small & Not At Table
The wizard character is too small and doesn't reach the table properly.

**Fix:**
- Scale up the wizard character significantly (2-3x bigger)
- Position seated AT the table, hands should reach the board
- Character should be imposing, sitting across from player
- Eye level should be looking at board

### Issue 2: Can't Move Pieces - Hit Areas Overlap
Player cannot move pawn forward one square because the piece's hit area blocks the destination square behind it.

**CRITICAL FIX:**
- When a piece is SELECTED, disable its hit area so player can click THROUGH to squares behind
- Or: Make piece float UP and AWAY when selected so it doesn't block destination squares
- Reduce piece hit area size to not overlap adjacent squares
- Selected piece should move aside or become non-blocking

### Issue 3: Character Should Animate When Moving Pieces
When AI makes a move, the wizard should:
- Gesture toward the piece being moved
- Wave wand with magical effect
- Piece should glow/lift when AI "touches" it
- Show clear animation of AI making the move

## Technical Implementation

### File: `src/components/vr/WizardStudy.jsx`

**Fix AIOpponent size and position:**
```jsx
// Current position is [0, 0, -0.8] - needs adjustment
// Scale up the entire character
// Position hands to reach table/board level

<group position={[0, 0, -0.6]} scale={1.8}>
  {/* Wizard at table height, closer to board */}
</group>
```

**Add move animation:**
- Pass `lastMove` prop with {from, to} coordinates
- Animate hand/wand toward piece location
- Add magical particle trail

### File: `src/components/vr/VRChessPiece.jsx`

**Fix hit area blocking:**
```jsx
// When piece is selected, disable its interaction
// So clicks pass through to squares behind it
<Interactive
  onSelect={handleSelect}
  onHover={handleHover}
  onBlur={handleBlur}
  disabled={isSelected}  // CRITICAL: Disable when selected!
>
```

**Float selected piece out of the way:**
```jsx
// Move selected piece UP and slightly toward player
// So it doesn't block the destination square
const targetY = isSelected ? 0.12 : 0;  // Float much higher
const targetZ = isSelected ? 0.03 : 0;  // Move toward player slightly
```

### File: `src/components/vr/VRChessBoard.jsx`

**Ensure squares are always clickable:**
- Squares should have higher render order than pieces when piece is selected
- Or pieces should become non-interactive when selected

## Success Criteria

1. ✅ AI wizard is properly sized, sitting at table with hands reaching board
2. ✅ Can select a pawn and click the square directly in front of it
3. ✅ Selected pieces float high and don't block destination squares
4. ✅ AI wizard animates when making moves (hand gesture, wand glow)
5. ✅ Build passes with no errors

## Files to Modify

1. `src/components/vr/WizardStudy.jsx` - Fix AIOpponent size/position, add move animation
2. `src/components/vr/VRChessPiece.jsx` - Disable hit area when selected, float higher
3. `src/components/vr/VRChessGame.jsx` - Pass lastMove to WizardStudy
