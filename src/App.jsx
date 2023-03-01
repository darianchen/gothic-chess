import './App.css';
import Board from './components/Board';
import Rook from './classes/Rook';
import Knight from './classes/Knight';
import Bishop from './classes/Bishop';
import Princess from './classes/Princess';
import Empress from './classes/Empress';
import Queen from './classes/Queen';

function App() {
  const board = new Array(8).fill().map(()=> new Array(10).fill(null));

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
  }

  startGame();

  return (
    <div className="App">
      <Board board={board}/>
    </div>
  )
}

export default App
