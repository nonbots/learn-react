import React, { useState } from 'react'
import './App.css'

function getWinner(board: string[][]): string|null {
  const winningRow = board.filter(row => {
    return row.join("") === "XXX" || row.join("") === "OOO";
  });
  if (winningRow.length !== 0) return winningRow[0][0];
  for (let row = 0; row < board.length; row += 1) {
    const colValues = []
    for (let col = 0; col < board[0].length; col += 1) {
      colValues.push(board[col][row]);
    }
    if (colValues.join("") === "XXX" || colValues.join("") === "OOO") return colValues[0];
  }

  let leftCol = 0;
  let rightCol = board[0].length - 1;
  const leftDiagonal: string[] = [];
  const rightDiagonal: string[] = [];
  for (let row = 0; row < board.length; row += 1) {
    const leftValue = board[row][leftCol]
    const rightValue = board[row][rightCol]
    if (!leftValue && !rightValue ) return null;
    leftDiagonal.push(leftValue);
    rightDiagonal.push(rightValue);
    leftCol += 1;
    rightCol -= 1;
  }
  if (leftDiagonal.every(value => value === leftDiagonal[0])) return leftDiagonal[0];
  if (rightDiagonal.every(value => value === rightDiagonal[0])) return rightDiagonal[0];
  return null;

}

function App() {
 const [player, setPlayer] = useState(true);
 const [board, setBoard] = useState(new Array(3).fill(undefined).map( _row => new Array(3).fill(null)));
 const [histories, setHistories] = useState([board]);
 const isWinner = getWinner(board);
 const winner = isWinner ? isWinner : "No one";

function handleClick (row: number, col: number) {
  if (board[row][col] || getWinner(board)) return;
  const updatedBoard = board.map(row => row.slice());
  if (player) {
    updatedBoard[row][col] = "X";
  } else {
    updatedBoard[row][col] = "O";
  }
  setBoard(updatedBoard); 
  const updatedHistories = histories.map(history => history.slice().map(row => row.slice()));
  updatedHistories.push(updatedBoard);
  setHistories(updatedHistories);
  console.log({histories});
  setPlayer(!player);
}
const UIBoard = board.map((row, index) => {
  return (
  <div className='row'>
    <Square mark={row[0]} onClick={() => handleClick(index, 0)}/>
    <Square mark={row[1]} onClick={() => handleClick(index, 1)}/>
    <Square mark={row[2]} onClick={() => handleClick(index, 2)}/>
  </div>
)});
 return (
  <>
    <div>
      {UIBoard}
    </div>
    <div>
      <p>{winner} won!</p>
    </div>
  </>
 )
}

function Square({mark, onClick}: {mark: string, onClick: React.MouseEventHandler<HTMLDivElement>}) {
  return (
    <div className='square' onClick={onClick}>
      <p>{mark}</p>
    </div>
  )
}
export default App
