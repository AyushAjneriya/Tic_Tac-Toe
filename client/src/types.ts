export type Player = 'X' | 'O';
export type BoardState = (Player | null)[];

export interface MoveRequest {
  board: BoardState;
  index: number;
  player: Player;
}

export interface MoveResponse {
  board: BoardState;
  winner: Player | 'Draw' | null;
  isDraw: boolean;
  isValid: boolean;
  winningLine?: number[];
  error?: string;
}
