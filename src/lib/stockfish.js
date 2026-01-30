// Chess AI using heuristic evaluation
// Provides intelligent move selection without external dependencies

// Piece values for evaluation
const PIECE_VALUES = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000
};

// Position bonuses for pieces (encourages good positioning)
const POSITION_BONUS = {
  pawn: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
  ],
  knight: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  bishop: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  rook: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
  ],
  queen: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  king: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
  ]
};

// Evaluate a single piece's value including position
const evaluatePiece = (piece, row, col) => {
  const baseValue = PIECE_VALUES[piece.type];
  const positionTable = POSITION_BONUS[piece.type];

  // For black pieces, flip the position table
  const posRow = piece.color === 'white' ? row : 7 - row;
  const positionValue = positionTable ? positionTable[posRow][col] : 0;

  return baseValue + positionValue;
};

// Evaluate the entire board from a color's perspective
const evaluateBoard = (board, forColor) => {
  let score = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const pieceValue = evaluatePiece(piece, row, col);
        if (piece.color === forColor) {
          score += pieceValue;
        } else {
          score -= pieceValue;
        }
      }
    }
  }

  return score;
};

// Difficulty settings
const DIFFICULTY_SETTINGS = {
  easy: { depth: 1, randomness: 0.4 },
  medium: { depth: 2, randomness: 0.15 },
  hard: { depth: 3, randomness: 0.05 }
};

// Get valid moves for a piece (simplified - actual validation is in ChessBoard)
const getValidMovesForPiece = (board, row, col, piece) => {
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

  return moves;
};

// Minimax with alpha-beta pruning
const minimax = (board, depth, alpha, beta, maximizingPlayer, forColor) => {
  if (depth === 0) {
    return evaluateBoard(board, forColor);
  }

  const currentColor = maximizingPlayer ? forColor : (forColor === 'white' ? 'black' : 'white');

  let allMoves = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === currentColor) {
        const moves = getValidMovesForPiece(board, r, c, piece);
        moves.forEach(move => {
          allMoves.push({ from: { row: r, col: c }, to: move, piece });
        });
      }
    }
  }

  if (allMoves.length === 0) {
    return maximizingPlayer ? -10000 : 10000;
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of allMoves) {
      const newBoard = board.map(r => r.map(c => c ? { ...c } : null));
      newBoard[move.to.row][move.to.col] = move.piece;
      newBoard[move.from.row][move.from.col] = null;

      const evalScore = minimax(newBoard, depth - 1, alpha, beta, false, forColor);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of allMoves) {
      const newBoard = board.map(r => r.map(c => c ? { ...c } : null));
      newBoard[move.to.row][move.to.col] = move.piece;
      newBoard[move.from.row][move.from.col] = null;

      const evalScore = minimax(newBoard, depth - 1, alpha, beta, true, forColor);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

// Get best move using minimax
export const getBestMove = async (board, currentTurn, difficulty = 'medium') => {
  const settings = DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.medium;

  // Get all possible moves
  const allMoves = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === currentTurn) {
        const moves = getValidMovesForPiece(board, r, c, piece);
        moves.forEach(move => {
          allMoves.push({ from: { row: r, col: c }, to: move, piece });
        });
      }
    }
  }

  if (allMoves.length === 0) {
    return null;
  }

  // Evaluate each move
  const evaluatedMoves = allMoves.map(move => {
    const newBoard = board.map(r => r.map(c => c ? { ...c } : null));
    newBoard[move.to.row][move.to.col] = move.piece;
    newBoard[move.from.row][move.from.col] = null;

    const score = minimax(newBoard, settings.depth - 1, -Infinity, Infinity, false, currentTurn);

    // Add some randomness based on difficulty
    const randomFactor = (Math.random() - 0.5) * settings.randomness * 200;

    return { ...move, score: score + randomFactor };
  });

  // Sort by score and pick the best
  evaluatedMoves.sort((a, b) => b.score - a.score);

  // For easy difficulty, sometimes pick a suboptimal move
  if (difficulty === 'easy' && Math.random() < 0.3 && evaluatedMoves.length > 1) {
    const randomIndex = Math.floor(Math.random() * Math.min(5, evaluatedMoves.length));
    return evaluatedMoves[randomIndex];
  }

  return evaluatedMoves[0];
};

// Cleanup function (no-op for heuristic AI)
export const terminateStockfish = () => {
  // No cleanup needed for heuristic AI
};

// Convert board to FEN (kept for compatibility)
export const boardToFen = (board, currentTurn) => {
  const pieceToFen = {
    king: 'k', queen: 'q', rook: 'r', bishop: 'b', knight: 'n', pawn: 'p'
  };

  let fen = '';
  for (let row = 0; row < 8; row++) {
    let emptyCount = 0;
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }
        const letter = pieceToFen[piece.type];
        fen += piece.color === 'white' ? letter.toUpperCase() : letter;
      } else {
        emptyCount++;
      }
    }
    if (emptyCount > 0) fen += emptyCount;
    if (row < 7) fen += '/';
  }
  fen += ` ${currentTurn === 'white' ? 'w' : 'b'} KQkq - 0 1`;
  return fen;
};
