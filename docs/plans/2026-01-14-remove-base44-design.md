# Design: Remove Base44 Dependency

## Goal

Convert this chess app from Base44 platform to vanilla React with no external platform dependencies.

## Decisions

| Component | Before (Base44) | After (Vanilla) |
|-----------|-----------------|-----------------|
| Data storage | `base44.entities.*` | LocalStorage service |
| AI opponent | `InvokeLLM` | Stockfish.js (WebAssembly) |
| Authentication | `base44.auth` | Removed entirely |
| Build tooling | `@base44/vite-plugin` | Standard Vite + React |

## Storage Layer

New file `src/api/storage.js` provides:

```javascript
export const storage = {
  PlayerProfile: {
    list(),      // Get all profiles from localStorage
    create(data), // Create with auto-generated ID
    update(id, data)
  },
  MatchHistory: {
    list(),
    create(data)
  }
}
```

Data stored in localStorage keys:
- `chess_profiles` - player profiles array
- `chess_matches` - match history array

## Stockfish AI Integration

New file `src/lib/stockfish.js`:
- Initialize Stockfish WebAssembly worker
- Convert board state to FEN notation
- `getBestMove(fen, skillLevel, depth)` async function

Difficulty mapping:
- Easy: Skill 0-5, depth 1-3
- Medium: Skill 6-12, depth 5-8
- Hard: Skill 13-20, depth 10-15

## Files to Delete

- `src/api/base44Client.js`
- `src/lib/AuthContext.jsx`
- `src/lib/app-params.js`
- `src/lib/NavigationTracker.jsx`
- `src/lib/PageNotFound.jsx`
- `src/components/UserNotRegisteredError.jsx`

## Files to Modify

- `package.json` - remove Base44 deps, add stockfish.js
- `vite.config.js` - remove Base44 plugin
- `src/main.jsx` - remove AuthProvider
- `src/pages/Chess.jsx` - use new storage API
- `src/components/chess/ChessBoard.jsx` - use Stockfish
- `src/App.jsx` - remove auth routing
- `README.md` - update setup instructions

## Dependencies

Remove:
- `@base44/sdk`
- `@base44/vite-plugin`

Add:
- `stockfish.js` (or `stockfish-nnue.wasm` for better performance)
