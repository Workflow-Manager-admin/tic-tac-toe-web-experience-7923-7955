import React, { useState, useEffect } from 'react';
import './App.css';

// Theme colors from request
const COLORS = {
  primary: '#1976d2',
  secondary: '#424242',
  accent: '#ff9800',
  lightBG: '#fff',
  lightPanel: '#f8f9fa',
  boardLine: '#e0e0e0'
};

// PUBLIC_INTERFACE
function App() {
  // Board is a 9 element array: null, 'X', or 'O'
  const [board, setBoard] = useState(Array(9).fill(null));
  // 'X' starts
  const [xIsNext, setXIsNext] = useState(true);
  // 'X', 'O', or null for no winner
  const [winner, setWinner] = useState(null);
  // True if draw
  const [isDraw, setIsDraw] = useState(false);
  // Show board highlight for winning cells
  const [winningLine, setWinningLine] = useState([]);
  // Player names (optional, for fun, could be extended)
  const [players] = useState([{ name: 'Player 1', mark: 'X' }, { name: 'Player 2', mark: 'O' }]);
  // For minimal side navigation ("New Game", etc.)
  const [navOpen, setNavOpen] = useState(false);

  // PUBLIC_INTERFACE
  useEffect(() => {
    // Check for winner or draw after each move
    const res = calculateWinner(board);
    if (res) {
      setWinner(res.winner);
      setWinningLine(res.line);
      setIsDraw(false);
    } else if (board.every(v => v !== null)) {
      setWinner(null);
      setWinningLine([]);
      setIsDraw(true);
    } else {
      setWinner(null);
      setWinningLine([]);
      setIsDraw(false);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (board[idx] || winner || isDraw) return;
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
  }

  // PUBLIC_INTERFACE
  function currentPlayer() {
    return xIsNext ? players[0] : players[1];
  }

  // PUBLIC_INTERFACE
  function renderStatus() {
    if (winner) {
      return (
        <div className="game-status" style={{ color: COLORS.accent }}>
          <b>{players[winner === 'X' ? 0 : 1].name} wins! 🎉</b>
        </div>
      );
    }
    if (isDraw) {
      return (
        <div className="game-status" style={{ color: COLORS.secondary }}>
          <b>It's a draw!</b>
        </div>
      );
    }
    return (
      <div className="game-status" style={{ color: COLORS.primary }}>
        <b>{currentPlayer().name}&nbsp;({xIsNext ? 'X' : 'O'})&nbsp;to move</b>
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function renderBoard() {
    return (
      <div className="board" role="grid" aria-label="Tic Tac Toe board">
        {board.map((cell, idx) => {
          const highlight = winningLine && winningLine.includes(idx);
          return (
            <button
              key={idx}
              className={`square${highlight ? ' highlight' : ''}`}
              aria-label={`Cell ${idx + 1} ${cell ? cell : ''}`}
              onClick={() => handleSquareClick(idx)}
              disabled={!!board[idx] || !!winner || isDraw}
              tabIndex={0}
            >
              <span>{cell}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function renderSideNav() {
    return (
      <nav className={`side-nav${navOpen ? ' open' : ''}`} aria-label="Minimal Navigation">
        <button className="close-btn" onClick={() => setNavOpen(false)} aria-label="Close Nav">&times;</button>
        <ul>
          <li>
            <button className="nav-btn" onClick={resetGame} tabIndex={0}>
              🔄 New Game
            </button>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <div className="ttt-root">
      {renderSideNav()}
      <header className="ttt-header">
        <button
          className="menu-btn"
          onClick={() => setNavOpen(true)}
          aria-label="Open Navigation"
        >
          ☰
        </button>
        <h1 className="title" style={{ color: COLORS.primary }}>Tic Tac Toe</h1>
      </header>
      <main className="main-layout">
        <section className="game-panel">
          <div className="player-info-wrap">
            <div className="player-info" style={{ color: COLORS.secondary }}>
              <span className={xIsNext ? 'active' : ''}>X: {players[0].name}</span>
              <span className={!xIsNext ? 'active' : ''}>O: {players[1].name}</span>
            </div>
            {renderStatus()}
          </div>
          {renderBoard()}
          <div className="game-actions">
            <button className="reset-btn" onClick={resetGame} tabIndex={0}>
              {winner || isDraw ? 'Start New Game' : 'Reset'}
            </button>
          </div>
        </section>
      </main>
      <footer className="ttt-footer">
        <span>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" style={{color: COLORS.secondary, fontWeight: 600}}>
            React Tic Tac Toe
          </a>
        </span>
      </footer>
    </div>
  );
}

// --- Helper: Winner logic ---
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  // Returns {winner: 'X' | 'O', line: [idx,idx,idx]} or null
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6] // diagnl
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

export default App;
