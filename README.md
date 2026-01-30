# Chess App

A magical chess game with AI opponent powered by Stockfish.

## Features

- Play against AI with three difficulty levels (Easy, Medium, Hard)
- Play against a friend locally
- Learning mode with move hints and explanations
- Player profiles with stats tracking
- Beautiful animated UI

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173 in your browser

## Tech Stack

- React 18
- Vite
- TailwindCSS
- Framer Motion (animations)
- Stockfish.js (chess AI)
- LocalStorage (data persistence)

## Game Modes

- **Learning Mode**: Shows hints, move explanations, and danger indicators
- **Pro Mode**: Standard chess without assistance

## Data Storage

Player profiles and match history are stored in browser localStorage. Data persists across sessions but is local to your browser.
