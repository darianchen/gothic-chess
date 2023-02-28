import './App.css';
import Board from './components/Board';
import Rook from './classes/Rook';
import Knight from './classes/Knight';
import Bishop from './classes/Bishop';

function App() {
  const board = new Array(8).fill().map(()=> new Array(10).fill(null));

  function startGame(){
    new Rook('white',board,[7,0]);
    new Rook('white',board,[7,9]);
    new Knight('black',board,[0,1]);
    new Bishop('black', board,[0,3]);
  }

  startGame();

  return (
    <div className="App">
      <Board board={board}/>
    </div>
  )
}

export default App
