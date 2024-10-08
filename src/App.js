import { useState } from 'react';

function Square({ value, onSquareClick, winning }) {

  return (
    <button className={`square ${winning ? 'winning-square' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  let status;

  function handleClick(i) {
    
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const result = calculateWinner(squares);
  const winningSquares = result ? result.winningSquares : [];


  if (result) {
    status = 'Winner: ' + result.winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  if (!squares.includes(null) && !calculateWinner(squares)) {
    status = 'The Game is a Draw';
  }

  function renderSquares() {
    let renders = [];
    let counter = 0;

    for (let i = 0; i < 3; i++) {
      let row = [];

      for (let k = 0; k < 3; k++) {
        // captures the current value of counter during each loop iteration to avoid any unexpected behavior with closures. 
        const currentCounter = counter;
        row.push(<Square key={currentCounter} value={squares[currentCounter]} onSquareClick={() => handleClick(currentCounter)} winning={winningSquares.includes(currentCounter)} />);
        counter++;
      }

      renders.push(<div key={i} className="board-row">
        {row}
      </div>);
    }

    return renders;
  }

  return (
    <div>
      <div className="status">{status}</div>
      {renderSquares()}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function sortMoves() {
    setIsAscending(!isAscending);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move#' + move;
    } else {
      description = 'Go to game start';
    }


    return (

      <li key={move}>
        {
          move == currentMove ? (
            <>you are at move # {move}</>) : (
            <button onClick={() => jumpTo(move)}>{description}</button>)
        }
      </li>
    );
  });


  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={sortMoves}>Toggle Moves</button>
        <ol>{isAscending ? moves : moves.slice().reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }
  return null;
}
