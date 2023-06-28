import { useState } from 'react';
import uniqid from "uniqid";

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Game() {

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAscending, setSortAscending] = useState(true);

  // const [xIsNext, setXIsNext] = useState(true);
  const xIsNext = currentMove % 2 === 0;

  // const currentSquares = history[history.length - 1]
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    
    // setHistory([...history, nextSquares]);
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSortOrder() {
    setSortAscending(!sortAscending);
    const element = document.getElementById('x');
    element.classList.add('square-win');
  }

  let moves = history.map((__, i) => {
    let description;
    if (i > 0) {
      description = "Go to move # " + i;
    } else {
      description = "Go to game start";
    }

    return (
      <li key = {uniqid()}>
        {currentMove === i ? <p>{description}</p> : <button onClick={() => jumpTo(i)}>{description}</button> }   
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button id='x' onClick={toggleSortOrder}>Toggle Sort Order</button>
        <ol>{sortAscending ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}


function Board({squares, onPlay, xIsNext}) {
  
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

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }


  // Generate the grid of squares using nested loops
  const rows = [];
  for (let i = 0; i < 3; i++) {
    const squaresInRow = [];
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      squaresInRow.push(
        <Square
          className="square-win"
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
        />
      );
    }
    rows.push(
      <div key={i} className="board-row">
        {squaresInRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
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
      return squares[a];
    }
  }
  return null;
}
