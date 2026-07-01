import { useState } from 'react'
import { X, Circle, RotateCcw, Crown, AlertCircle } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { BoardState, Player, MoveRequest, MoveResponse } from './types'

export default function App() {
  // Game States
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null))
  const [turn, setTurn] = useState<Player>('X')
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null)
  const [isDraw, setIsDraw] = useState<boolean>(false)
  const [winningLine, setWinningLine] = useState<number[]>([])
  
  // App States
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [scores, setScores] = useState<{ X: number; O: number; Draws: number }>({
    X: 0,
    O: 0,
    Draws: 0,
  })

  // Handles a cell selection by requesting the backend to process the move
  const handleCellClick = async (index: number) => {
    // Prevent actions if cell occupied, game ended, or waiting for API
    if (board[index] !== null || winner || isDraw || loading) return

    setLoading(true)
    setError(null)

    // Build the request body matching the MoveRequest interface
    const requestData: MoveRequest = {
      board,
      index,
      player: turn,
    }

    try {
      const response = await fetch('/api/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const data = (await response.json()) as MoveResponse

      if (!response.ok || !data.isValid) {
        setError(data.error || 'Failed to validate move.')
        setLoading(false)
        return
      }

      // Update local game board state
      setBoard(data.board)

      // Handle Game Outcomes
      if (data.winner) {
        setWinner(data.winner)
        if (data.winningLine) {
          setWinningLine(data.winningLine)
        }

        // Update score tally
        if (data.winner === 'X') {
          setScores((prev) => ({ ...prev, X: prev.X + 1 }))
        } else if (data.winner === 'O') {
          setScores((prev) => ({ ...prev, O: prev.O + 1 }))
        } else if (data.winner === 'Draw') {
          setIsDraw(true)
          setScores((prev) => ({ ...prev, Draws: prev.Draws + 1 }))
        }
      } else if (data.isDraw) {
        setIsDraw(true)
        setWinner('Draw')
        setScores((prev) => ({ ...prev, Draws: prev.Draws + 1 }))
      } else {
        // Toggle Active Player Turn if no end-condition is met
        setTurn(turn === 'X' ? 'O' : 'X')
      }
    } catch (err) {
      console.error('API Error:', err)
      setError('Cannot connect to the game server. Ensure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  // Resets board state while keeping scores intact
  const handleReset = () => {
    setBoard(Array(9).fill(null))
    setTurn('X')
    setWinner(null)
    setIsDraw(false)
    setWinningLine([])
    setError(null)
  }

  // Resets the entire match, including the scoreboard
  const handleFullReset = () => {
    handleReset()
    setScores({ X: 0, O: 0, Draws: 0 })
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="ambient-glow glow-cyan" />
      <div className="ambient-glow glow-purple" />

      {/* Title Header */}
      <div className="z-10 text-center mb-6 animate-fade-in flex flex-col items-center">
        {/* Glow effect behind the logo */}
        <div className="relative mb-3 group">
          <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
          <img 
            src="/logo_shield.png" 
            alt="Grid Genius Logo" 
            className="relative w-28 h-auto drop-shadow-[0_0_12px_rgba(56,189,248,0.25)] transform group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
          GRID GENIUS
        </h1>
      </div>

      {/* Main Game Interface Card */}
      <Card className="z-10 w-full max-w-md glass-panel border-slate-800/80 animate-pop-in">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-bold flex justify-between items-center text-slate-100">
            <span>Arena</span>
            {/* Turn or Outcome Indicator */}
            {winner ? (
              winner === 'Draw' ? (
                <span className="text-sm px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-semibold animate-pulse-slow">
                  It's a Draw!
                </span>
              ) : (
                <span className={`text-sm px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 animate-pulse-slow ${
                  winner === 'X' 
                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-400 text-glow-cyan' 
                    : 'bg-purple-500/10 border-purple-500/30 text-purple-400 text-glow-purple'
                }`}>
                  <Crown className="w-3.5 h-3.5" /> Player {winner} Wins!
                </span>
              )
            ) : (
              <span className={`text-sm px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 ${
                turn === 'X' 
                  ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' 
                  : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
              }`}>
                Turn: Player {turn}
              </span>
            )}
          </CardTitle>
          <CardDescription className="text-slate-400 mt-1">
            Click any cell to make a move.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-fade-in">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Server Connection Error</p>
                <p className="mt-0.5 opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* Local Scoreboard Display */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
            <div className="text-center border-r border-slate-800/50">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Player X</p>
              <p className="text-2xl font-bold text-sky-400 text-glow-cyan mt-0.5">{scores.X}</p>
            </div>
            <div className="text-center border-r border-slate-800/50">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Draws</p>
              <p className="text-2xl font-bold text-slate-300 mt-0.5">{scores.Draws}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Player O</p>
              <p className="text-2xl font-bold text-purple-400 text-glow-purple mt-0.5">{scores.O}</p>
            </div>
          </div>

          {/* 3x3 Game Board Grid */}
          <div className="grid grid-cols-3 gap-3 aspect-square w-full max-w-[320px] mx-auto">
            {board.map((cell, index) => {
              const isWinningCell = winningLine.includes(index)
              const isEmpty = cell === null

              return (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  disabled={!isEmpty || !!winner || isDraw || loading}
                  className={`
                    relative aspect-square rounded-xl border flex items-center justify-center transition-all duration-300 group
                    ${
                      isEmpty 
                        ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/40 hover:border-slate-700 cursor-pointer active:scale-95' 
                        : isWinningCell 
                          ? cell === 'X'
                            ? 'bg-sky-500/25 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4)] animate-pulse'
                            : 'bg-purple-500/25 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-pulse'
                          : 'border-slate-800 bg-slate-950/80 cursor-default'
                    }
                  `}
                >
                  {/* Grid cell values */}
                  {cell === 'X' && (
                    <X className="w-10 h-10 md:w-12 md:h-12 text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)] animate-pop-in" />
                  )}
                  {cell === 'O' && (
                    <Circle className="w-8 h-8 md:w-10 md:h-10 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] animate-pop-in" />
                  )}

                  {/* Turn Hover Ghost Preview */}
                  {isEmpty && !winner && !isDraw && !loading && (
                    <span className="opacity-0 group-hover:opacity-20 transition-opacity duration-200">
                      {turn === 'X' ? (
                        <X className="w-10 h-10 md:w-12 md:h-12 text-sky-400" />
                      ) : (
                        <Circle className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
                      )}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Action Control Panel */}
          <div className="flex gap-2 justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullReset}
              className="text-slate-400 hover:text-red-400 hover:border-red-500/30"
            >
              Reset Scores
            </Button>
            
            <Button
              variant={winner || isDraw ? 'neonCyan' : 'secondary'}
              onClick={handleReset}
              className="flex items-center gap-2 px-5"
            >
              <RotateCcw className={`w-4 h-4 ${(loading) ? 'animate-spin' : ''}`} />
              Reset Game
            </Button>
          </div>
        </CardContent>
      </Card>


    </div>
  )
}
