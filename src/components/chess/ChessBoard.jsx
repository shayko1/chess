import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBestMove } from '@/lib/stockfish';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import confetti from 'canvas-confetti'; // Import confetti
import ChessPiece from './ChessPiece';
import MoveExplanation from './MoveExplanation';
import CheckAlert from './CheckAlert';
import VictoryScreen from './VictoryScreen';
import Sparkles from './Sparkles';
import MagicalTooltip from './MagicalTooltip';
import MagicalGuidePanel from './MagicalGuidePanel';

const INITIAL_BOARD = () => {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Black pieces (top)
  board[0] = [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' }
  ];
  board[1] = Array(8).fill(null).map(() => ({ type: 'pawn', color: 'black' }));
  
  // White pieces (bottom)
  board[6] = Array(8).fill(null).map(() => ({ type: 'pawn', color: 'white' }));
  board[7] = [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' }
  ];
  
  return board;
};

const getValidMoves = (board, row, col, piece, checkingForCheck = false) => {
  const moves = [];
  const color = piece.color;
  const enemyColor = color === 'white' ? 'black' : 'white';

  const addMove = (r, c) => {
    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const target = board[r][c];
      if (!target || target.color === enemyColor) {
        moves.push({ row: r, col: c, isCapture: !!target });
      }
    }
  };

  const addLineMoves = (directions) => {
    directions.forEach(([dr, dc]) => {
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const target = board[r][c];
        if (!target) {
          moves.push({ row: r, col: c, isCapture: false });
        } else if (target.color === enemyColor) {
          moves.push({ row: r, col: c, isCapture: true });
          break;
        } else {
          break;
        }
        r += dr;
        c += dc;
      }
    });
  };

  switch (piece.type) {
    case 'pawn':
      const direction = color === 'white' ? -1 : 1;
      const startRow = color === 'white' ? 6 : 1;
      
      // Forward move
      if (board[row + direction]?.[col] === null) {
        moves.push({ row: row + direction, col, isCapture: false });
        // Double move from start
        if (row === startRow && board[row + 2 * direction]?.[col] === null) {
          moves.push({ row: row + 2 * direction, col, isCapture: false });
        }
      }
      
      // Captures
      [-1, 1].forEach(dc => {
        const target = board[row + direction]?.[col + dc];
        if (target && target.color === enemyColor) {
          moves.push({ row: row + direction, col: col + dc, isCapture: true });
        }
      });
      break;

    case 'rook':
      addLineMoves([[0, 1], [0, -1], [1, 0], [-1, 0]]);
      break;

    case 'bishop':
      addLineMoves([[1, 1], [1, -1], [-1, 1], [-1, -1]]);
      break;

    case 'queen':
      addLineMoves([[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]);
      break;

    case 'knight':
      [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, dc]) => {
        addMove(row + dr, col + dc);
      });
      break;

    case 'king':
      [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([dr, dc]) => {
        addMove(row + dr, col + dc);
      });
      break;
  }

  // Filter out moves that would leave king in check
  if (!checkingForCheck) {
    return moves.filter(move => {
      const newBoard = board.map(r => r.map(c => c ? { ...c } : null));
      newBoard[move.row][move.col] = piece;
      newBoard[row][col] = null;
      return !isKingInCheck(newBoard, color);
    });
  }

  return moves;
};

const isKingInCheck = (board, kingColor) => {
  // Find king position
  let kingPos = null;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === 'king' && piece.color === kingColor) {
        kingPos = { row: r, col: c };
        break;
      }
    }
    if (kingPos) break;
  }

  if (!kingPos) return false;

  // Check if any enemy piece can capture the king
  const enemyColor = kingColor === 'white' ? 'black' : 'white';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === enemyColor) {
        const moves = getValidMoves(board, r, c, piece, true);
        if (moves.some(m => m.row === kingPos.row && m.col === kingPos.col)) {
          return { attacker: { row: r, col: c }, king: kingPos };
        }
      }
    }
  }

  return false;
};

const isCheckmate = (board, color) => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, r, c, piece);
        if (moves.length > 0) return false;
      }
    }
  }
  return true;
};

const getDangerousSquares = (board, color) => {
  const dangerous = new Set();
  const enemyColor = color === 'white' ? 'black' : 'white';
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === enemyColor) {
        const moves = getValidMoves(board, r, c, piece, true);
        moves.forEach(m => dangerous.add(`${m.row}-${m.col}`));
      }
    }
  }
  
  return dangerous;
};

const MOVE_EXPLANATIONS = {
  pawn: 'הרגלי יכול לזוז קדימה משבצת אחת, או שתיים בתור הראשון. הוא אוכל באלכסון!',
  rook: 'המגדל זז בקו ישר - למעלה, למטה, שמאלה או ימינה!',
  bishop: 'הקוסם זז רק באלכסון!',
  queen: 'המלכה חזקה מאוד! היא יכולה לזוז לכל כיוון!',
  knight: 'הפגסוס קופץ בצורת ר - שתיים ואז אחת הצידה!',
  king: 'המלך זז רק משבצת אחת לכל כיוון. תגן עליו!'
};

export default function ChessBoard({
  gameMode = 'learning',
  onMove,
  onGameEnd,
  savedState,
  whitePlayer,
  blackPlayer,
  playAgainstAI = false,
  aiLevel = 'medium',
  // Online multiplayer props
  isOnline = false,
  myColor = null,
  remoteMove = null,
  onLocalMove,
  onRemoteMoveProcessed
}) {
  const [board, setBoard] = useState(savedState?.board || INITIAL_BOARD);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(savedState?.turn || 'white');
  const [checkInfo, setCheckInfo] = useState(null);
  const [showExplanation, setShowExplanation] = useState(null);
  const [sparklePos, setSparklePos] = useState(null);
  const [gameStatus, setGameStatus] = useState('playing');
  const [moveHistory, setMoveHistory] = useState(savedState?.history || []);
  const [dangerousSquares, setDangerousSquares] = useState(new Set());
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [hoveredSquare, setHoveredSquare] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [guidePanel, setGuidePanel] = useState(null);
  const [showTooltips, setShowTooltips] = useState(true);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  // Process remote moves from opponent
  useEffect(() => {
    if (remoteMove && isOnline && gameStatus === 'playing') {
      const { from, to, piece } = remoteMove;

      // Execute the remote move
      const newBoard = board.map(r => r.map(c => c ? { ...c } : null));
      const movingPiece = newBoard[from.row][from.col];

      if (movingPiece) {
        newBoard[to.row][to.col] = movingPiece;
        newBoard[from.row][from.col] = null;

        // Handle pawn promotion
        if (movingPiece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
          newBoard[to.row][to.col] = { type: 'queen', color: movingPiece.color };
        }

        setBoard(newBoard);
        setSparklePos({ row: to.row, col: to.col });
        setTimeout(() => setSparklePos(null), 1000);

        const nextTurn = currentTurn === 'white' ? 'black' : 'white';

        // Check for check/checkmate
        const check = isKingInCheck(newBoard, nextTurn);
        if (check) {
          setCheckInfo(check);
          if (isCheckmate(newBoard, nextTurn)) {
            setGameStatus(currentTurn === 'white' ? 'white_wins' : 'black_wins');
            onGameEnd?.(currentTurn);
          }
        } else {
          setCheckInfo(null);
          if (isCheckmate(newBoard, nextTurn)) {
            setGameStatus('draw');
            onGameEnd?.('draw');
          }
        }

        const newMove = {
          from,
          to,
          piece: movingPiece,
          turn: currentTurn
        };
        setMoveHistory(prev => [...prev, newMove]);
        setCurrentTurn(nextTurn);
        onMove?.(newBoard, nextTurn, [...moveHistory, newMove]);
      }

      onRemoteMoveProcessed?.();
    }
  }, [remoteMove]);

  useEffect(() => {
    if (gameMode === 'learning') {
      setDangerousSquares(getDangerousSquares(board, currentTurn));
    }
  }, [board, currentTurn, gameMode]);

  const makeAIMove = useCallback(async () => {
    if (!playAgainstAI || currentTurn !== 'black' || isAIThinking || gameStatus !== 'playing') return;

    setIsAIThinking(true);

    try {
      // Get all possible moves for AI (used as fallback)
      const allPossibleMoves = [];
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = board[r][c];
          if (piece && piece.color === 'black') {
            const moves = getValidMoves(board, r, c, piece);
            moves.forEach(move => {
              allPossibleMoves.push({
                from: { row: r, col: c },
                to: move,
                piece
              });
            });
          }
        }
      }

      if (allPossibleMoves.length === 0) {
        setIsAIThinking(false);
        return;
      }

      let selectedMove = null;

      // Try to get move from Stockfish
      try {
        const stockfishMove = await getBestMove(board, 'black', aiLevel);

        if (stockfishMove) {
          // Find the matching move in our valid moves list
          const matchingMove = allPossibleMoves.find(m =>
            m.from.row === stockfishMove.from.row &&
            m.from.col === stockfishMove.from.col &&
            m.to.row === stockfishMove.to.row &&
            m.to.col === stockfishMove.to.col
          );

          if (matchingMove) {
            selectedMove = matchingMove;
          }
        }
      } catch (error) {
        console.error('Stockfish error:', error);
      }

      // Fallback: pick random valid move if Stockfish failed
      if (!selectedMove) {
        if (aiLevel === 'easy') {
          selectedMove = allPossibleMoves[Math.floor(Math.random() * allPossibleMoves.length)];
        } else {
          const captureMoves = allPossibleMoves.filter(m => m.to.isCapture);
          selectedMove = captureMoves.length > 0
            ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
            : allPossibleMoves[Math.floor(Math.random() * allPossibleMoves.length)];
        }
      }

      // Execute the move
      const newBoard = board.map(r => r.map(c => c ? { ...c } : null));
      const movingPiece = { ...selectedMove.piece };
      newBoard[selectedMove.to.row][selectedMove.to.col] = movingPiece;
      newBoard[selectedMove.from.row][selectedMove.from.col] = null;

      // Pawn promotion
      if (movingPiece.type === 'pawn' && selectedMove.to.row === 7) {
        newBoard[selectedMove.to.row][selectedMove.to.col] = { type: 'queen', color: 'black' };
      }

      setBoard(newBoard);
      setSparklePos({ row: selectedMove.to.row, col: selectedMove.to.col });
      setTimeout(() => setSparklePos(null), 1000);

      const check = isKingInCheck(newBoard, 'white');
      if (check) {
        setCheckInfo(check);
        if (isCheckmate(newBoard, 'white')) {
          setGameStatus('black_wins');
          onGameEnd?.('black');
        }
      } else {
        setCheckInfo(null);
        if (isCheckmate(newBoard, 'white')) {
          setGameStatus('draw');
          onGameEnd?.('draw');
        }
      }

      const newMove = {
        from: selectedMove.from,
        to: { row: selectedMove.to.row, col: selectedMove.to.col },
        piece: movingPiece,
        turn: 'black'
      };
      setMoveHistory(prev => [...prev, newMove]);
      setCurrentTurn('white');
      onMove?.(newBoard, 'white', [...moveHistory, newMove]);

    } catch (error) {
      console.error('AI move fatal error:', error);
    } finally {
      setIsAIThinking(false);
    }
  }, [board, currentTurn, playAgainstAI, isAIThinking, gameStatus, aiLevel, moveHistory, onMove, onGameEnd]);

  useEffect(() => {
    if (playAgainstAI && currentTurn === 'black' && gameStatus === 'playing') {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, playAgainstAI, gameStatus, makeAIMove]);

  const handleSquareClick = useCallback((row, col) => {
    if (gameStatus !== 'playing') return;
    if (playAgainstAI && currentTurn === 'black') return; // Don't allow clicks during AI turn

    // In online mode, only allow moves when it's my turn
    if (isOnline && myColor !== currentTurn) {
      setShowExplanation({
        message: 'זה לא התור שלך! מחכה ליריב...'
      });
      return;
    }

    const piece = board[row][col];

    // Select piece
    if (gameMode === 'learning' && piece && piece.color === currentTurn && !selectedPiece) {
      setSelectedPiece({ row, col, piece });
      const moves = getValidMoves(board, row, col, piece);
      setValidMoves(moves);
      return;
    }

    // If clicking on valid move destination
    if (selectedPiece && validMoves.some(m => m.row === row && m.col === col)) {
      // Make the move
      const newBoard = board.map(r => r.map(c => c ? { ...c } : null));
      const movingPiece = newBoard[selectedPiece.row][selectedPiece.col];
      newBoard[row][col] = movingPiece;
      newBoard[selectedPiece.row][selectedPiece.col] = null;

      // Check for pawn promotion
      if (movingPiece.type === 'pawn' && (row === 0 || row === 7)) {
        newBoard[row][col] = { type: 'queen', color: movingPiece.color };
      }

      setBoard(newBoard);
      setSparklePos({ row, col });
      setTimeout(() => setSparklePos(null), 1000);

      // Trigger confetti on capture
      if (newBoard[row][col] && board[row][col]) { // If destination has a piece (capture)
         confetti({
            particleCount: 30,
            spread: 40,
            origin: { 
                x: (col + 1) / 9, // Approximate x position
                y: (row + 1) / 9  // Approximate y position
            },
            colors: ['#FF69B4', '#9370DB'] // Pink/Purple for magic capture
         });
      }

      const nextTurn = currentTurn === 'white' ? 'black' : 'white';

      // Check for check/checkmate
      const check = isKingInCheck(newBoard, nextTurn);
      if (check) {
        setCheckInfo(check);
        
        // Trigger confetti for check
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500'] // Gold/Orange for check
        });

        if (isCheckmate(newBoard, nextTurn)) {
          setGameStatus(currentTurn === 'white' ? 'white_wins' : 'black_wins');
          onGameEnd?.(currentTurn);
          
          // Big confetti for checkmate
          confetti({
            particleCount: 200,
            spread: 160,
            origin: { y: 0.6 }
          });
        }
      } else {
        setCheckInfo(null);
        // Check for stalemate
        if (isCheckmate(newBoard, nextTurn)) {
          setGameStatus('draw');
          onGameEnd?.('draw');
        }
      }

      const newMove = {
        from: { row: selectedPiece.row, col: selectedPiece.col },
        to: { row, col },
        piece: movingPiece,
        turn: currentTurn
      };
      setMoveHistory(prev => [...prev, newMove]);

      // Send move to remote player in online mode
      if (isOnline && onLocalMove) {
        onLocalMove(
          { row: selectedPiece.row, col: selectedPiece.col },
          { row, col },
          movingPiece
        );
      }

      setCurrentTurn(nextTurn);
      setSelectedPiece(null);
      setValidMoves([]);

      onMove?.(newBoard, nextTurn, [...moveHistory, newMove]);
      return;
    }

    // If clicking on own piece
    if (piece && piece.color === currentTurn) {
      setSelectedPiece({ row, col, piece });
      const moves = getValidMoves(board, row, col, piece);
      setValidMoves(moves);
      return;
    }

    // If clicking on enemy piece without valid move
    if (piece && piece.color !== currentTurn && selectedPiece && gameMode === 'learning') {
      setShowExplanation({
        message: 'זה לא התור שלך! עכשיו תור של ' + (currentTurn === 'white' ? 'הצבא הלבן ✨' : 'הצבא השחור 🔮')
      });
      return;
    }

    // If clicking on invalid square with piece selected
    if (selectedPiece && gameMode === 'learning') {
      const moves = getValidMoves(board, selectedPiece.row, selectedPiece.col, selectedPiece.piece);
      if (moves.length === 0) {
        setShowExplanation({
          message: 'אין מהלכים חוקיים לכלי הזה עכשיו!'
        });
      } else {
        setShowExplanation({
          message: MOVE_EXPLANATIONS[selectedPiece.piece.type]
        });
      }
    }

    setSelectedPiece(null);
    setValidMoves([]);
  }, [board, selectedPiece, validMoves, currentTurn, gameStatus, gameMode, moveHistory, onMove, onGameEnd, isOnline, myColor, onLocalMove]);

  const getSquareColor = (row, col) => {
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedPiece?.row === row && selectedPiece?.col === col;
    const isValidMove = validMoves.some(m => m.row === row && m.col === col);
    const isCapture = validMoves.some(m => m.row === row && m.col === col && m.isCapture);
    const isDangerous = gameMode === 'learning' && dangerousSquares.has(`${row}-${col}`);
    const isCheckSquare = checkInfo && ((checkInfo.attacker.row === row && checkInfo.attacker.col === col) ||
                          (checkInfo.king.row === row && checkInfo.king.col === col));

    if (isSelected) return 'bg-amber-300';
    if (isCapture) return 'bg-red-400/70';
    if (isValidMove) return 'bg-emerald-400/70';
    if (isCheckSquare) return 'bg-red-500/50';
    if (isLight) return 'bg-gradient-to-br from-pink-100 to-purple-100';
    return 'bg-gradient-to-br from-purple-200 to-pink-200';
  };

  const handleMouseMove = (e, row, col) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" dir="rtl">
      {/* Controls & Turn indicator */}
      <div className="mb-4 flex flex-col items-center gap-3">
        {/* Turn Badge */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full shadow-lg ${
            currentTurn === 'white' 
              ? 'bg-gradient-to-r from-pink-200 to-purple-200 text-purple-800' 
              : 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white'
          }`}>
            <span className="text-2xl">
              {currentTurn === 'white' ? '✨' : (playAgainstAI && isAIThinking ? '🤖💭' : '🔮')}
            </span>
            <span className="text-lg font-bold">
              {isAIThinking ? 'AI חושב...' : 
                `תור ${currentTurn === 'white' ? whitePlayer || 'צבא האור' : blackPlayer || 'צבא הצללים'}`
              }
            </span>
          </div>
        </motion.div>

        {/* Tooltips Toggle */}
        {gameMode === 'learning' && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-white/40">
              <Switch
                id="tooltip-mode"
                checked={showTooltips}
                onCheckedChange={setShowTooltips}
                className="data-[state=checked]:bg-purple-500"
              />
              <Label htmlFor="tooltip-mode" className="text-xs font-medium text-purple-800 cursor-pointer">
                הצג רמזים
              </Label>
            </div>

            {selectedPiece && (
               <button 
                 onClick={() => setGuidePanel(selectedPiece.piece)}
                 className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md hover:scale-105 transition-transform flex items-center gap-2"
               >
                 <span>📖</span>
                 הסבר על הכלי
               </button>
            )}
          </div>
        )}
      </div>

      {/* Check Alert */}
      <AnimatePresence>
        {checkInfo && gameMode === 'learning' && (
          <CheckAlert onClose={() => setCheckInfo(null)} />
        )}
      </AnimatePresence>

      {/* Magical Background Scene */}
      <div className="relative mb-4 rounded-3xl overflow-hidden shadow-2xl">
        {/* Sky background with floating islands */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-purple-100 to-pink-100" />
        <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iY2xvdWRzIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMzAiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjQwIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4yIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2Nsb3VkcykiLz48L3N2Zz4=')]" />
        
        {/* Floating magical particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${i % 2 === 0 ? 'bg-yellow-300' : 'bg-pink-300'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Crystal Board Container */}
        <div className="relative p-4 sm:p-6">
          {/* Board frame - magical crystal */}
          <div className="absolute inset-2 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-2xl blur-xl" />
          
          <div className="relative bg-gradient-to-br from-purple-200/40 via-white/50 to-pink-200/40 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border-4 border-white/60 shadow-[0_0_40px_rgba(168,85,247,0.3)] transform-style-3d perspective-1000">
            <div className="grid grid-cols-8 gap-0.5 rounded-xl overflow-hidden relative transform transition-transform duration-500 hover:rotate-x-2 hover:rotate-y-2"
                 style={{ transformStyle: 'preserve-3d' }}
                 onMouseLeave={() => {
                   if (hoverTimeout) clearTimeout(hoverTimeout);
                   setHoveredSquare(null);
                 }}>
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  aspect-square relative cursor-pointer
                  ${getSquareColor(rowIndex, colIndex)}
                  transition-all duration-200
                `}
                style={{
                  boxShadow: (rowIndex + colIndex) % 2 === 0 
                    ? 'inset 0 2px 8px rgba(255,255,255,0.3)' 
                    : 'inset 0 2px 8px rgba(147,51,234,0.2)',
                }}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                onMouseEnter={(e) => {
                  if (hoverTimeout) clearTimeout(hoverTimeout);
                  const timeout = setTimeout(() => {
                    setHoveredSquare({ row: rowIndex, col: colIndex, piece });
                  }, 600); // 600ms delay
                  setHoverTimeout(timeout);
                  handleMouseMove(e, rowIndex, colIndex);
                }}
                onMouseLeave={() => {
                  if (hoverTimeout) clearTimeout(hoverTimeout);
                  setHoveredSquare(null);
                }}
                onMouseMove={(e) => handleMouseMove(e, rowIndex, colIndex)}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 0 20px rgba(168,85,247,0.4)',
                }}
              >
                {/* Valid move indicator */}
                {validMoves.some(m => m.row === rowIndex && m.col === colIndex && !m.isCapture) && !piece && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="w-4 h-4 rounded-full bg-emerald-500/50" />
                  </motion.div>
                )}

                {/* Sparkles on move */}
                {sparklePos?.row === rowIndex && sparklePos?.col === colIndex && (
                  <Sparkles />
                )}

                {/* Danger indicator for learning mode */}
                {gameMode === 'learning' && piece && piece.color === currentTurn && 
                 dangerousSquares.has(`${rowIndex}-${colIndex}`) && (
                  <motion.div
                    className="absolute top-1 right-1 text-xs"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    ⚠️
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {piece && (
                    <motion.div
                      style={{
                        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
                      }}
                    >
                      <ChessPiece
                        key={`piece-${rowIndex}-${colIndex}`}
                        piece={piece}
                        isSelected={selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex}
                        isInDanger={gameMode === 'learning' && piece.color === currentTurn && dangerousSquares.has(`${rowIndex}-${colIndex}`)}
                        onClick={() => {}}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                </motion.div>
            ))
          )}

             {/* Magical Hover Tooltip */}
              {hoveredSquare && gameMode === 'learning' && showTooltips && (
                <MagicalTooltip
                  piece={hoveredSquare.piece}
                  squarePosition={!hoveredSquare.piece ? { row: hoveredSquare.row, col: hoveredSquare.col } : null}
                  position={tooltipPosition}
                />
              )}
           </div>
          </div>
          </div>
          </div>

          {/* Move Explanation Popup */}
      <AnimatePresence>
        {showExplanation && gameMode === 'learning' && (
          <MoveExplanation
            message={showExplanation.message}
            onClose={() => setShowExplanation(null)}
          />
        )}
      </AnimatePresence>

      {/* Magical Guide Panel */}
      {guidePanel && gameMode === 'learning' && (
        <MagicalGuidePanel
          piece={guidePanel}
          onClose={() => setGuidePanel(null)}
        />
      )}

      {/* Victory Screen */}
      <AnimatePresence>
        {gameStatus !== 'playing' && (
          <VictoryScreen
            winner={gameStatus === 'draw' ? null : (gameStatus === 'white_wins' ? whitePlayer : blackPlayer)}
            isDraw={gameStatus === 'draw'}
            onClose={() => setGameStatus('playing')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}