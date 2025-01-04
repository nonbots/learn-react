import React, { useState } from 'react'
import './App.css'

function getWinner(board: string[][]): string | null {
  const winningRow = board.filter(row => {
    return row.join("") === "XXX" || row.join("") === "OOO";
  });
  if (winningRow.length !== 0) return winningRow[0][0];
  for (let row = 0; row < board.length; row += 1) {
    const colValues: string[] = [];
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
    if (!leftValue && !rightValue) return null;
    leftDiagonal.push(leftValue);
    rightDiagonal.push(rightValue);
    leftCol += 1;
    rightCol -= 1;
  }
  if (leftDiagonal.every(value => value === leftDiagonal[0])) return leftDiagonal[0];
  if (rightDiagonal.every(value => value === rightDiagonal[0])) return rightDiagonal[0];
  return null;

}
function App() { //Game component
  const [player, setPlayer] = useState(true);
  let curPlayerMark = (player) ? "X" : "O";
  const [histories, setHistories] = useState([new Array(3).fill(undefined).map(_row => new Array(3).fill(null))]);
  //let curBoard: string[][] = histories[histories.length - 1];
  const [curBoard, setCurBoard] = useState(histories[histories.length - 1]);
  const isWinner = getWinner(curBoard);
  const winner = isWinner ? isWinner : "No one";
  function handlePlay(nextBoard: string[][]): void {
    //const newHistories: String[][][] = histories.slice(); // deep copy of the histories 
    const newHistories: String[][][] = histories.map(history => history.slice().map(row => row.slice())); // deep copy of the histories 
    newHistories.push(nextBoard);
    setHistories(newHistories);
    //setCurBoard(newHistories.slice(newHistories.length - 1, newHistories.length)[0]);// grabbing the lastest history from history does not work because I was calling on histories not new histories
    setCurBoard(newHistories[newHistories.length - 1]);//
    setPlayer(!player)
  }
  function jumpTo(index: number) {
    //const newHistories: String[][][] = histories.slice(0, index + 1);
    //setHistories(newHistories);
    //setHistories(histories[index]);
    setCurBoard(histories[index]);
    //setCurBoard(histories.splice(index, 1)[0]);
  }
  // take the current histories and create buttons for each history 
  const historyBtns = histories.map((history, index) => {
    return (
      <li key={index}>
        <button onClick={() => jumpTo(index)}>{index + 1}</button>
      </li>
    )
  })

  return (
    <>
      <div>
        <p> Current Player: {curPlayerMark}</p>
      </div>
      <Board player={player} curBoard={curBoard} onPlay={(curBoard) => handlePlay(curBoard)} />
      <div>
        <p>{winner} won!</p>
      </div>
      <div>
        {historyBtns}
      </div>
    </>
  )
}

function Board({ player, curBoard, onPlay }: { player: boolean, curBoard: string[][], onPlay: (curBoard: string[][]) => void }) {

  function handleClick(row: number, col: number) {
    if (curBoard[row][col] || getWinner(curBoard)) return;
    //const updatedBoard = curBoard.map(row => row);
    const updatedBoard = curBoard.map(row => row.slice());
    //const updatedBoard = curBoard.slice();
    if (player) {
      updatedBoard[row][col] = "X";
    } else {
      updatedBoard[row][col] = "O";
    }
    onPlay(updatedBoard);
  }

  const UIBoard = curBoard.map((row, index) => {
    return (
      <div className='row' key={index}>
        <Square mark={row[0]} onClick={() => handleClick(index, 0)} />
        <Square mark={row[1]} onClick={() => handleClick(index, 1)} />
        <Square mark={row[2]} onClick={() => handleClick(index, 2)} />
      </div>
    )
  });
  return (
    <>
      <div>
        {UIBoard}
      </div>
    </>
  )
}

function Square({ mark, onClick }: { mark: string, onClick: React.MouseEventHandler<HTMLDivElement> }) {
  return (
    <div className='square' onClick={onClick}>
      <p>{mark}</p>
    </div>
  )
}
export default App
