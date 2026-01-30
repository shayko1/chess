import { useState, useCallback } from 'react';
import { getBestMove } from '@/lib/stockfish';

// Initial board setup
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

// Get valid moves for a piece
export const getValidMoves = (board, row, col, piece, checkingForCheck = false) => {
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
    case 'pawn': {
      const direction = color === 'white' ? -1 : 1;
      const startRow = color === 'white' ? 6 : 1;

      if (board[row + direction]?.[col] === null) {
        moves.push({ row: row + direction, col, isCapture: false });
        if (row === startRow && board[row + 2 * direction]?.[col] === null) {
          moves.push({ row: row + 2 * direction, col, isCapture: false });
        }
      }

      [-1, 1].forEach(dc => {
        const target = board[row + direction]?.[col + dc];
        if (target && target.color === enemyColor) {
          moves.push({ row: row + direction, col: col + dc, isCapture: true });
        }
      });
      break;
    }
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

// Check if king is in check
export const isKingInCheck = (board, kingColor) => {
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

// Check for checkmate
export const isCheckmate = (board, color) => {
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

// Custom hook for chess game logic
export function useChessGame({ playAgainstAI = false, aiLevel = 'medium', onGameEnd } = {}) {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [currentTurn, setCurrentTurn] = useState('white');
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, white_wins, black_wins, draw
  const [checkInfo, setCheckInfo] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [isAIThinking, setIsAIThinking] = useState(false);

  // Select a piece
  const selectPiece = useCallback((row, col) => {
    const piece = board[row][col];
    if (piece && piece.color === currentTurn) {
      setSelectedPiece({ row, col, piece });
      const moves = getValidMoves(board, row, col, piece);
      setValidMoves(moves);
      return true;
    }
    return false;
  }, [board, currentTurn]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedPiece(null);
    setValidMoves([]);
  }, []);

  // Make a move
  const makeMove = useCallback((fromRow, fromCol, toRow, toCol) => {
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    // Check if move is valid
    const moves = getValidMoves(board, fromRow, fromCol, piece);
    const isValidMove = moves.some(m => m.row === toRow && m.col === toCol);
    if (!isValidMove) return false;

    // Execute move
    const newBoard = board.map(r => r.map(c => c ? { ...c } : null));
    const movingPiece = { ...piece };
    newBoard[toRow][toCol] = movingPiece;
    newBoard[fromRow][fromCol] = null;

    // Pawn promotion
    if (movingPiece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
      newBoard[toRow][toCol] = { type: 'queen', color: movingPiece.color };
    }

    setBoard(newBoard);

    const nextTurn = currentTurn === 'white' ? 'black' : 'white';

    // Check for check/checkmate
    const check = isKingInCheck(newBoard, nextTurn);
    if (check) {
      setCheckInfo(check);
      if (isCheckmate(newBoard, nextTurn)) {
        const winner = currentTurn;
        setGameStatus(winner === 'white' ? 'white_wins' : 'black_wins');
        onGameEnd?.(winner);
      }
    } else {
      setCheckInfo(null);
      if (isCheckmate(newBoard, nextTurn)) {
        setGameStatus('draw');
        onGameEnd?.('draw');
      }
    }

    const newMove = {
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      piece: movingPiece,
      turn: currentTurn
    };
    setMoveHistory(prev => [...prev, newMove]);
    setCurrentTurn(nextTurn);
    setSelectedPiece(null);
    setValidMoves([]);

    return true;
  }, [board, currentTurn, onGameEnd]);

  // AI move
  const makeAIMove = useCallback(async () => {
    if (!playAgainstAI || currentTurn !== 'black' || isAIThinking || gameStatus !== 'playing') return;

    setIsAIThinking(true);

    try {
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

      try {
        const stockfishMove = await getBestMove(board, 'black', aiLevel);
        if (stockfishMove) {
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
        console.error('AI error:', error);
      }

      if (!selectedMove) {
        selectedMove = allPossibleMoves[Math.floor(Math.random() * allPossibleMoves.length)];
      }

      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));

      makeMove(selectedMove.from.row, selectedMove.from.col, selectedMove.to.row, selectedMove.to.col);
    } finally {
      setIsAIThinking(false);
    }
  }, [board, currentTurn, playAgainstAI, isAIThinking, gameStatus, aiLevel, makeMove]);

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(INITIAL_BOARD());
    setCurrentTurn('white');
    setSelectedPiece(null);
    setValidMoves([]);
    setGameStatus('playing');
    setCheckInfo(null);
    setMoveHistory([]);
    setIsAIThinking(false);
  }, []);

  return {
    board,
    currentTurn,
    selectedPiece,
    validMoves,
    gameStatus,
    checkInfo,
    moveHistory,
    isAIThinking,
    selectPiece,
    clearSelection,
    makeMove,
    makeAIMove,
    resetGame,
    getValidMoves: (row, col) => {
      const piece = board[row][col];
      if (!piece) return [];
      return getValidMoves(board, row, col, piece);
    }
  };
}
