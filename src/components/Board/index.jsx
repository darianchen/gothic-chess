import './index.css';
import whiterook from '../../assets/whiterook.png';
import blackknight from '../../assets/blackknight.png';
import Piece from '../../classes/Piece.js';
import { useState } from 'react';

function Board (){
    const[count, setCount] = useState(0);

    const testBoard = [
        [null,null,null,null,null,null,null,null,null,null,],
        [null,null,null,null,null,null,null,null,null,null,],
        [null,null,null,null,null,null,null,null,null,null,],
        [null,null,null,null,null,null,null,null,null,null,],
        [null,null,null,null,null,null,null,null,null,null,],
        [null,null,null,null,null,null,null,null,null,null,],
        [null,null,null,null,null,null,null,null,null,null,],
        [null,null,null,null,null,null,null,null,null,null,],
    ];
    const colors = ['white','black'];

    let theBoard = testBoard;

    const rook = new Piece('white',theBoard, [1,1], whiterook);
    const knight = new Piece('black',theBoard, [6,1], blackknight);

    theBoard[1][1] = rook;
    theBoard[6][1] = knight;

    function handlePieceMove(piece, newPosition){
        piece.move(newPosition);
        setCount(count + 1);
        console.log(theBoard);
    }

    window.handlePieceMove = handlePieceMove;
    window.rook = rook;

    return(
        <>
            <h1>This is the Board</h1>
            <div>
                {theBoard.map((theRow,rowIdx)=>{
                    return <div className="row" key={rowIdx}>
                        {theRow.map( (theCol,colIdx)=>{
                            return <div className="tile" id={colors[(rowIdx+colIdx)%2]} key={colIdx}>
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