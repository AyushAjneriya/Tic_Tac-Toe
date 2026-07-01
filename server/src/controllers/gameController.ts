import { Request, Response } from 'express';
import { BoardState, MoveRequest, MoveResponse } from '../types';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

/**
 * Helper to check if a board has a winning line.
 */
function checkWinner(board: BoardState): { winner: 'X' | 'O' | null; line?: number[] } {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combo };
    }
  }
  return { winner: null };
}

/**
 * Helper to check if the board is fully occupied.
 */
function checkDraw(board: BoardState): boolean {
  return board.every(cell => cell !== null);
}

/**
 * Validates and processes a player's move.
 */
export const makeMove = (req: Request, res: Response) => {
  const { board, index, player } = req.body as MoveRequest;

  // 1. Basic validation of fields
  if (!board || !Array.isArray(board) || board.length !== 9) {
    return res.status(400).json({
      isValid: false,
      error: 'Invalid board state. Board must be an array of length 9.',
      board: board || Array(9).fill(null),
      winner: null,
      isDraw: false
    });
  }

  if (player !== 'X' && player !== 'O') {
    return res.status(400).json({
      isValid: false,
      error: "Invalid player. Player must be 'X' or 'O'.",
      board,
      winner: null,
      isDraw: false
    });
  }

  if (typeof index !== 'number' || index < 0 || index > 8) {
    return res.status(400).json({
      isValid: false,
      error: 'Invalid index. Move index must be an integer between 0 and 8.',
      board,
      winner: null,
      isDraw: false
    });
  }

  // 2. Validate game state before move
  const preMoveResult = checkWinner(board);
  if (preMoveResult.winner) {
    return res.status(400).json({
      isValid: false,
      error: `Move rejected. Game has already been won by player ${preMoveResult.winner}.`,
      board,
      winner: preMoveResult.winner,
      winningLine: preMoveResult.line,
      isDraw: false
    });
  }

  if (checkDraw(board)) {
    return res.status(400).json({
      isValid: false,
      error: 'Move rejected. Game has already ended in a draw.',
      board,
      winner: 'Draw',
      isDraw: true
    });
  }

  // 3. Validate cell vacancy
  if (board[index] !== null) {
    return res.status(400).json({
      isValid: false,
      error: `Move rejected. Spot ${index} is already occupied by ${board[index]}.`,
      board,
      winner: null,
      isDraw: false
    });
  }

  // 4. Execute the move (creating a new board state copy)
  const updatedBoard = [...board];
  updatedBoard[index] = player;

  // 5. Evaluate the new game state
  const postMoveResult = checkWinner(updatedBoard);
  const isDraw = !postMoveResult.winner && checkDraw(updatedBoard);

  const response: MoveResponse = {
    board: updatedBoard,
    winner: postMoveResult.winner ? postMoveResult.winner : (isDraw ? 'Draw' : null),
    isDraw,
    isValid: true,
    winningLine: postMoveResult.line
  };

  return res.status(200).json(response);
};
