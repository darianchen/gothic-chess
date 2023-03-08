import './App.css';
import Board from './components/Board';
import Rook from './classes/Rook';
import Knight from './classes/Knight';
import Bishop from './classes/Bishop';
import Princess from './classes/Princess';
import Empress from './classes/Empress';
import Queen from './classes/Queen';
import King from './classes/King';
import Pawn from './classes/Pawn';
import Navbar from './components/Navbar';

function App() {
  let board = new Array(8).fill().map(()=> new Array(10).fill(null));

  function startGame(){
    new Rook('black',board,[0,0]);
    new Rook('black',board,[0,9]);
    new Knight('black',board,[0,1]);
    new Knight('black',board,[0,8]);
    new Bishop('black', board,[0,2]);
    new Bishop('black', board,[0,7]);
    new Queen('white',board,[7,3]);
    new Queen('black',board,[0,3]);
    new Empress('black', board,[0,4]);
    new Princess('black',board,[0,6]);
    new Empress('white', board,[7,4]);
    new Princess('white',board,[7,6]);
    new Rook('white',board,[7,0]);
    new Rook('white',board,[7,9]);
    new Knight('white',board,[7,1]);
    new Knight('white',board,[7,8]);
    new Bishop('white',board,[7,2]);
    new Bishop('white',board,[7,7]);
    new King('black',board,[0,5]);
    new King('white',board,[7,5]);

    for(let col=0;col <= 9;col++){
      new Pawn('white',board,[6,col]);
      new Pawn('black',board,[1,col]);
    }


    // create board to test castling
    // must also change number of pieces in board component

    // new Rook('black',board,[0,0]);
    // new Rook('black',board,[0,9]);
    // new King('black',board,[0,5]);
    // new Knight('white',board,[6,1]);
    // new Rook('white',board,[7,0]);
    // new King('white',board,[7,5]);
    // new Rook('white',board,[7,9]);

    // create a board to test stalemate && checkmate

    // new King('black',board,[1,9]);
    // new King('white',board,[7,4]);
    // new Rook('white',board,[7,5]);
    // new Queen('white',board,[6,8]);
    // new Queen('white',board,[3,3]);
    // new Knight('black',board,[1,1]);
    // new Bishop('white',board,[1,3]);
  }

  const moveLog = [];
  startGame();

  let boardHistory = ['This is the Board History'];

  return (
    <div className="App">
      <Navbar />
      <Board board={board} moveLog={moveLog} boardHistory={boardHistory}/>
    </div>
  )
}

export default App