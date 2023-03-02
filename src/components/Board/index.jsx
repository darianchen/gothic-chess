import './index.css';
import { useState } from 'react';

function Board(props){
    let theBoard = props.board;
    const colors = ['black','white'];
    const tileColors = ['white','black']
    const [turn, setTurn] = useState(1);
    const [isFlipped, setIsFlipped] = useState(false);
    const [numPieces, setNumPieces] = useState(40);

    function handlePieceMove(piece, newPosition){
        if( piece.canMove(newPosition) && piece.color === colors[turn%2] ){
            if(piece.move(newPosition)) {
                setTurn(turn+1);
                const newNumPieces = calculateNumPieces(theBoard);
                setNumPieces(newNumPieces);
                if(newNumPieces !== numPieces) {
                    let captureAudio = new Audio('https://raw.githubusercontent.com/darianchen/gothic-chess/main/src/assets/Audio/capture.mp3');
                    captureAudio.play();
                } else {
                    let moveAudio = new Audio('https://raw.githubusercontent.com/darianchen/gothic-chess/main/src/assets/Audio/move.mp3');
                    moveAudio.play();
                }
            }
        } else {
            // handle error
        }
    }      

    function calculateNumPieces(board) {
        return board.reduce((count, row) => {
          return count + row.filter(square => square != null).length;
        }, 0);
      }
            
    // stuff for testing
    window.handlePieceMove = handlePieceMove;
    window.board = theBoard;

    let originSquare= null;
    function selectPiece(e){
        e.preventDefault();
        if(!originSquare) originSquare = e.target.id.split(',').map((str)=>parseInt(str));
        if(!theBoard[originSquare[0]][originSquare[1]]) originSquare = null;

    }

    function selectMove(e){
        if(originSquare){
            const destinationSquare = e.target.id.split(',').map((str)=>parseInt(str));
            handlePieceMove(theBoard[originSquare[0]][originSquare[1]], destinationSquare)
        }
        originSquare = null;
    }

    function flipBoard(){
        setIsFlipped(!isFlipped);
    }

    return(
        <>
            <h1>Gothic Chess</h1>
            <h1>It's {colors[turn%2]}'s turn.</h1>
            <button onClick={flipBoard}>Flip</button>
            <div className={`my-component ${isFlipped ? 'flip' : ''}`}>
                {theBoard.map((theRow,rowIdx)=>{
                    return <div className="row" key={rowIdx}>
                        {theRow.map( (theCol,colIdx)=>{
                            return <div 
                                        className={`${tileColors[(rowIdx+colIdx)%2]} ${theBoard[rowIdx][colIdx] ? "has-piece" : ""} ${isFlipped ? 'flip' : ''}`}
                                        id={[rowIdx,colIdx]} key={colIdx}
                                        onMouseDown={selectPiece}
                                        onMouseUp={selectMove}
                                    >
                                {theBoard[rowIdx][colIdx] ? <img src={theBoard[rowIdx][colIdx].image}></img> : ''}
                            </div>
                        })}
                    </div>
                })}
            </div>
        </>
    )
};

export default Board;