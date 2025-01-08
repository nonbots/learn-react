import React, { useState } from 'react';
import './App.css';

function getWinningSquares(board: string[][]): number[][] | null {
  let winningRow;
  board.forEach((row, index) => {
    if (row.join('') === 'XXX' || row.join('') === 'OOO')
      winningRow = [
        [index, 0],
        [index, 1],
        [index, 2],
      ];
  });
  if (winningRow) return winningRow;

  for (let row = 0; row < board.length; row += 1) {
    const colValues: string[] = [];
    const positions: number[][] = [];
    for (let col = 0; col < board[0].length; col += 1) {
      colValues.push(board[col][row]);
      positions.push([col, row]);
    }
    if (colValues.join('') === 'XXX' || colValues.join('') === 'OOO') winningRow = positions;
  }
  if (winningRow) return winningRow;

  let leftCol = 0;
  let rightCol = board[0].length - 1;
  const leftDiagonal: string[] = [];
  const rightDiagonal: string[] = [];
  const positionsRight: number[][] = [];
  const positionsLeft: number[][] = [];
  for (let row = 0; row < board.length; row += 1) {
    const leftValue = board[row][leftCol];
    const rightValue = board[row][rightCol];
    if (!leftValue && !rightValue) return null;
    positionsRight.push([row, leftCol]);
    positionsLeft.push([row, rightCol]);
    rightDiagonal.push(rightValue);
    rightDiagonal.push(rightValue);
    leftCol += 1;
    rightCol -= 1;
  }
  if (leftDiagonal.every((value) => value === leftDiagonal[0])) return positionsLeft;
  if (rightDiagonal.every((value) => value === rightDiagonal[0])) return positionsRight;
  return null;
}
function App() {
  //Game component
  const [histories, setHistories] = useState([new Array(3).fill(undefined).map((_row) => new Array(3).fill(null))]);
  const [curMove, setMove] = useState(histories.length - 1);
  const curBoard = histories[curMove];
  let player = curMove % 2 === 0;
  let curPlayerMark = player ? 'X' : 'O';
  const winningSquares = getWinningSquares(curBoard);
  const winner = winningSquares ? curBoard[winningSquares[0][0]][winningSquares[0][1]] : 'No one';

  function handlePlay(nextBoard: string[][]): void {
    console.log({ curMove, histories });
    const newHistories: String[][][] = [...structuredClone(histories).slice(0, curMove + 1), nextBoard];
    setHistories(newHistories);
    setMove(newHistories.length - 1);
  }

  function jumpTo(index: number) {
    setMove(index);
  }
  const historyBtns = histories.map((_history, index) => {
    return index === curMove ? (
      <li key={index}>
        <p>You are at move {index + 1} </p>
      </li>
    ) : (
      <li key={index}>
        <button onClick={() => jumpTo(index)}>{index + 1}</button>
      </li>
    );
  });

  function toggleSort() {
    setHistories(structuredClone(histories).reverse());
    //historyBtns.reverse();
  }
  return (
    <>
      <p> Current Player: {curPlayerMark}</p>
      <Board player={player} curBoard={curBoard} onPlay={(curBoard) => handlePlay(curBoard)} />
      <p>{winner} won!</p>
      <button onClick={() => toggleSort()}> Sort </button>
      <ol>{historyBtns}</ol>
    </>
  );
}

function Board({
  player,
  curBoard,
  onPlay,
}: {
  player: boolean;
  curBoard: string[][];
  onPlay: (curBoard: string[][]) => void;
}) {
  function handleClick(row: number, col: number) {
    const winningSquares = getWinningSquares(curBoard);
    if (curBoard[row][col] || winningSquares) {
      /*return (
        <div>
          {curBoard.map((row, rowIndex) => {
            return (
              <div className="row" key={rowIndex}>

                {row.map((mark, colIndex) => {
                  return <Square mark={mark} onClick={() => handleClick(rowIndex, colIndex)} />;
                })}
              </div>
            );
          })}
        </div>
      );*/
      return;
    }

    const updatedBoard = structuredClone(curBoard);
    player ? (updatedBoard[row][col] = 'X') : (updatedBoard[row][col] = 'O');
    onPlay(updatedBoard);
  }

  return (
    <div>
      {curBoard.map((row, rowIndex) => {
        return (
          <div className="row" key={rowIndex}>
            {row.map((mark, colIndex) => {
              return <Square mark={mark} onClick={() => handleClick(rowIndex, colIndex)} />;
            })}
          </div>
        );
      })}
    </div>
  );
}

function Square({ mark, onClick }: { mark: string; onClick: React.MouseEventHandler<HTMLDivElement> }) {
  return (
    <div className="square" onClick={onClick}>
      <p>{mark}</p>
    </div>
  );
}

export default App;
