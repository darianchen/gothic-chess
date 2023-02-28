import './index.css';
import { useState } from 'react';

function Board(props){
    let theBoard = props.board;
    const colors = ['black','white'];
    const[turn, setTurn] = useState(1);

    function handlePieceMove(piece, newPosition){
        piece.move(newPosition);
        setTurn(turn+1);
        // console.log(theBoard);
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

    return(
        <>
            <h1>This is the Board</h1>
            <h1>It's {colors[turn%2]}'s turn.</h1>
            <div>
                {theBoard.map((theRow,rowIdx)=>{
                    return <div className="row" key={rowIdx}>
                        {theRow.map( (theCol,colIdx)=>{
                            return <div 
                                        className={colors[(rowIdx+colIdx)%2]}
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