import './index.css';
import { useState } from 'react';
import King from '../../classes/King'; 
import blackKingChecked from '../../assets/Images/black_king_check.png';
import whiteKingChecked from '../../assets/Images/white_king_check.png';
import MoveLog from '../MoveLog/MoveLog';

function Board(props){
    let theBoard = props.board;
    const colors = ['black','white'];
    // const tileColors = ['white','black']

    const rows = [8,7,6,5,4,3,2,1];
    const cols = 'abcdefghij'.split('');
    const moveLog = props.moveLog;


    const [turn, setTurn] = useState(1);

    const [isFlipped, setIsFlipped] = useState(false);
    const [numPieces, setNumPieces] = useState(40);
    const captureAudio = new Audio('https://raw.githubusercontent.com/darianchen/gothic-chess/main/src/assets/Audio/capture.mp3');
    const moveAudio = new Audio('https://raw.githubusercontent.com/darianchen/gothic-chess/main/src/assets/Audio/move.mp3');

    function handlePieceMove(piece, newPosition){
        let thisMove = ''
        let oldRow = piece.position[0];
        let oldCol = piece.position[1];
        thisMove += piece.letter;
        
        if( piece.canMove(newPosition) && piece.color === colors[turn%2] ){
            if(piece.move(newPosition)) {
                setTurn(turn+1);
                
                const newNumPieces = calculateNumPieces(theBoard);
                setNumPieces(newNumPieces);
                updateCheckedKingImage(theBoard);

                if(newNumPieces !== numPieces) {
                    captureAudio.play();
                    if(!piece.letter) thisMove+=cols[oldCol];
                    thisMove += 'x'
                } else {
                    moveAudio.play();
                }
                thisMove += cols[newPosition[1]];
                thisMove += rows[newPosition[0]];
                moveLog.push(thisMove);
                // console.log(moveLog);
            }
        } else {
            // handle error
            console.error('Illegal Move')
        }
    }      

    function updateCheckedKingImage(board) {
        const king = board.flat().find((piece) => piece instanceof King && piece.inCheck(piece.position[0], piece.position[1]));
        if (king) {
            king.image = (king.color === 'white') ? whiteKingChecked :
            (king.color === 'black') ? blackKingChecked : king.image;
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

    function formatMoves(moveLog){ 
        const rows = [];
        for(let i=0;i<=moveLog.length;i+=2){
            rows.push([1+(i/2),moveLog[i],moveLog[i+1]])
        }
        return rows;
    }

    return(
        <>
            <h1>Gothic Chess</h1>
            <h1>It's {colors[turn%2]}'s turn.</h1>
            <button onClick={flipBoard}>Flip</button>
            <div className='move-log-holder'>
                <div className={`my-component ${isFlipped ? 'flip' : ''}`}>
                    {theBoard.map((theRow,rowIdx)=>{
                        return <div className="row" key={rowIdx}>
                            {theRow.map( (theCol,colIdx)=>{
                                return <div 
                                            className={`${colors[(rowIdx+colIdx+1)%2]} ${theBoard[rowIdx][colIdx] ? "has-piece" : ""} ${isFlipped ? 'flip' : ''}`}
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

                <MoveLog moveLog={formatMoves(moveLog)} turn={turn}/>
            </div>
        </>
    )
};

export default Board;