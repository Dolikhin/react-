import { useState } from "react";

function Square({ value, onSquareClick, isWinningSquare }) {

  return <button
    className={`square ${isWinningSquare ? "winning-square" : ""}`}
    onClick={onSquareClick}
  >{value}</button>
}

function Board({ xIsNext, squares, onPlay }) {
  const result = calculateGameResult(squares);
  const winner = result?.winner;
  const winningLine = result?.line || [];

  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }
 
  const status = winner
    ? winner === "Draw"
      ? "Ничья"
      : "Winner: " + winner
    : "Next player: " + (xIsNext ? "X" : "O");

  const renderSquare = (i) => (
    <Square 
    key={i} 
    value={squares[i]} 
    onSquareClick={() => handleClick(i)} 
    isWinningSquare={winningLine.includes(i)}
    />
  );

  
  return (
    <>
      <div className="status">{status}</div>
      {[0, 3, 6].map((rowStart) => (
        <div key={rowStart} className="board-row">
          {[0, 1, 2].map((colOffset) => renderSquare(rowStart + colOffset))}
        </div>
      ))}
    </>
  );
}


export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscending, setIsAscending] = useState(true);

  const toggleSortOrder = () => {
    setIsAscending(!isAscending);
  };

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {


    let description = move > 0 ? 'Go to move #' + move : 'Go to game start';
    if (currentMove === move) {
      description = "Вы на ходу №…" + move;
    }



    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>

    );
  });

  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
     
        <button onClick={toggleSortOrder}>
          {isAscending ? 'Сортировать по убыванию' : 'Сортировать по возрастанию'}
        </button>
        <ol>{sortedMoves}</ol>

      </div>
    </div>
  );
}

function getWinningLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return lines.find(([a, b, c]) =>
    squares[a] && squares[a] === squares[b] && squares[a] === squares[c]
  );
}

function isDraw(squares) {
  return squares.every(square => square !== null);
}

function calculateGameResult(squares) {
  const winningLine = getWinningLine(squares);
  if (winningLine) {
    return { winner: squares[winningLine[0]], line: winningLine };
  }
  return isDraw(squares) ? { winner: "Draw", line: [] } : null;
}

