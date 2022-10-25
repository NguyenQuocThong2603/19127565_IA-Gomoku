import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';



function Square(props) {
  if(props.isBold){
    return (
      <button className="square bold" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}



class Board extends React.Component { 

  renderSquare(i,j) {
    let isBold = false;
    if(this.props.winner){
      const winningSquare =this.props.winner.winningLine.some(element => {
        return element[0] ===i && element[1] ===j
      });
      if(winningSquare){
        isBold = true;
      }
    }
    return (
      <Square
        key={"row "+i+" column"+j}
        value={this.props.squares[i][j]}
        onClick={() => this.props.onClick(i,j)}
        isBold ={isBold}
      />
    );
  }

  render() {
    let board = []
    for(let i =0;i<5;i++){
      let content =[]
      for(let j =0;j<5;j++){
        content.push(this.renderSquare(i,j))
      }
      board.push(<div className="board-row"key= {"row"+i}>{content}</div>)
    }
    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    let squares = Array(5)
    for(let i =0;i<5;i++){
      squares[i] = Array(5).fill(null)
    }
    this.state = {
      history: [{
        squares: squares,
        row: 0,
        column: 0
      }],
      stepNumber: 0,
      xIsNext: true,
      isDesc: true,
      isCompleted: false,
    };
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i,j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    let squares = current.squares.slice();
    squares =squares.map((item,index) => item = current.squares[index].slice())

    if (calculateWinner(squares)|| squares[i][j]) {
      return;
    }
    squares[i][j] = this.state.xIsNext ? 'X' : 'O';
    const isCompleted = squares.every((square) => {
      return square.every((value) => value!==null )
    })
    this.setState({
      history: history.concat([{
        squares: squares,
        row: i,
        column: j,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      isCompleted: isCompleted,
    });
  }
  changeMode(){
    if(this.state.isDesc){
      this.setState({isDesc: false})
    }
    else{
      this.setState({isDesc: true})
    }
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      let desc = 'Go to game start';
      if(move){
        desc = `Go to move #${move} (row ${this.state.history[move].row} column ${this.state.history[move].column})`
        if(move === this.state.stepNumber) desc= <b>Go to move #{move} (row {this.state.history[move].row} column {this.state.history[move].column}</b>;
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    if(this.state.isCompleted){
      status = <b>Draw</b>
    }
    if(!this.state.isDesc) moves.reverse()

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winner={winner}
            onClick={(i,j) => this.handleClick(i,j)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div className="toggle-button">
          <div>
            Descending
          </div>
          <label className="switch">
            <input type="checkbox"/>
            <span className="slider round" onClick={() => this.changeMode()}></span>
          </label>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {

  for(let i=0;i<5;i++) {
    for(let j = 0;j<5;j++){
      // check row of element
      if(!squares[i][j]) continue;
      let result = [];
      result.push([i,j])
      for(let k = j + 1;k<5;k++) {
        if(squares[i][j]!==squares[i][k]){
          break;
        }
        result.push([i,k]);
      }
      
      if(result.length === 5){

        const winner = {
          winningLine: result,
          winner: squares[result[0][0]][result[0][1]]
        }
        return winner
      }
      else{
        result = result.slice(0,1);
      }
      // check column of element
      for(let k = i + 1;k<5;k++) {
        if(squares[i][j]!==squares[k][j]){
          break;
        }
        result.push([k,j]);
      }

      if(result.length === 5){

        const winner = {
          winningLine: result,
          winner: squares[result[0][0]][result[0][1]]
        }
        return winner
      }
      else{
        result = result.slice(0,1);
      }

      // check right diagonal
      let increaseRow = i + 1;
      for(let k = j + 1;k<5;k++) {
        if(increaseRow > 4){
          break;
        }
        if(squares[i][j]!==squares[increaseRow][k]){
          break;
        }
        result.push([increaseRow,k]);
        increaseRow+=1;
      }

      if(result.length === 5){

        const winner = {
          winningLine: result,
          winner: squares[result[0][0]][result[0][1]]
        }
        return winner
      }
      else{
        result = result.slice(0,1);
      }
      // check left diagonal
      increaseRow = i + 1;
      for(let k = j - 1;k>=0;k--){
        if(increaseRow>4){
          break;
        }
        if(squares[i][j]!==squares[increaseRow][k]){
          break;
        }
        result.push([increaseRow,k]);
        increaseRow+=1;
      }
      if(result.length === 5){
        const winner = {
          winningLine: result,
          winner: squares[result[0][0]][result[0][1]]
        }
        return winner
      }
    }
  }
  return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
