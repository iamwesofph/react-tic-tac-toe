import { useState } from 'react';
import uniqid from "uniqid";

function Square({value, onSquareClick, id}) {
  return (
    <button className="square" id={id} onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Game() {

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [location, setLocation] = useState([]);
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
    resetSquaresColor();
    setCurrentMove(nextMove);
  }

  function toggleSortOrder() {
    setSortAscending(!sortAscending);
  }

  function handleLocation (i) {
    const nextLocation = [...location, i] // Create new copy of array
    setLocation(nextLocation); // Save the new array into state
  }

  let moves = history.map((__, i) => {
    let description;
    if (i > 0) {
      const moveLocation = location[i-1];
      const gridSize = 3;
      const { row, col } = getRowAndColumn(moveLocation, gridSize);
      description = "Go to move # " + i + " on Row: " + row + " Col: " + col;
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
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} handleLocation={handleLocation} />
      </div>
      <div className="game-info">
        <button id='x' onClick={toggleSortOrder}>Toggle Sort Order</button>
        <ol>{sortAscending ? moves : moves.reverse()}</ol>
      </div>
        </div>
  );
}


function Board({squares, onPlay, xIsNext, currentMove, handleLocation}) {
  
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) { // interrupts code when f returns a winner and square is already marked 
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
    handleLocation(i); // Save the location of the clicked square into array
  }

  const winner = calculateWinner(squares); // when f returns a winner, update status text
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
    const winners = calculateWinnerSquares(squares);
    highlightWinnerSquares(winners);
  } else {
    if (currentMove === 9) {
      status = "It's a tie!";
    } else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
  }

  // Generate the grid of squares using nested loops
  const rows = [];
  for (let i = 0; i < 3; i++) {
    const squaresInRow = [];
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      squaresInRow.push(
        <Square
          key={index}
          id={"square-"+index} // IDs: square-0 square-1 square-2
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

function calculateWinnerSquares(squares) {
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
      return lines[i];
    }
  }
  return null;
}

function highlightWinnerSquares(winners) {
  for (const winner of winners) {
    const elementId = "square-" + winner;
    const square = document.getElementById(elementId);
    square.classList.add('square-win');
  }
}

function resetSquaresColor () {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach(square => {
    square.classList.remove('square-win');
  });
}

function getRowAndColumn(index, gridSize) {
  const row = Math.floor(index / gridSize) + 1;
  const col = (index % gridSize) + 1;
  return { row, col };
}
