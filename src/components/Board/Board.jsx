import { useEffect, useState } from 'react';

import King from '../../classes/King'; 
import Rook from '../../classes/Rook';
import Queen from '../../classes/Queen';
import Princess from '../../classes/Princess';
import Empress from '../../classes/Empress';
import Pawn from '../../classes/Pawn';
import Knight from '../../classes/Knight';
import Bishop from '../../classes/Bishop';

import blackKingChecked from '../../assets/Images/black_king_check.png';
import whiteKingChecked from '../../assets/Images/white_king_check.png';
import MoveLog from '../MoveLog/';
import Navbar from '../Navbar';

function Board(props){
    let theBoard = props.board;

    const colors = ['black','white'];
    const rows = [8,7,6,5,4,3,2,1];
    const cols = 'abcdefghij'.split('');
    const moveLog = props.moveLog;
    const [turn, setTurn] = useState(1);
    const [isFlipped, setIsFlipped] = useState(false);
    const [numPieces, setNumPieces] = useState(40);
    const captureAudio = new Audio('https://raw.githubusercontent.com/darianchen/gothic-chess/main/src/assets/Audio/capture.mp3');
    const moveAudio = new Audio('https://raw.githubusercontent.com/darianchen/gothic-chess/main/src/assets/Audio/move.mp3');
    const castleAudio = new Audio('https://raw.githubusercontent.com/darianchen/gothic-chess/main/src/assets/Audio/castle.mp3');
    const checkAudio = new Audio('https://raw.githubusercontent.com/darianchen/gothic-chess/main/src/assets/Audio/check.mp3');
    const stalemateAudio = new Audio('https://raw.githubusercontent.com/darianchen/gothic-chess/main/src/assets/Audio/stalemate.mp3');
    const checkmateAudio = new Audio('https://raw.githubusercontent.com/darianchen/gothic-chess/main/src/assets/Audio/checkmate.mp3');

    useEffect(() => {
        if (isStalemate(theBoard, isKingInCheck(theBoard))){
            window.alert('Stalemate');
            stalemateAudio.play();
        };
    },[turn])

    let boardHistory = props.boardHistory;

    function copyBoard(board){
        // console.log(boardHistory, 1)
        const boardCopy = new Array(board.length).fill().map(()=> new Array(board[0].length).fill(null));
        for(let r=0;r<board.length;r++){
            for(let c=0;c<board[0].length;c++){
                if(board[r][c]){
                    let pieceCopy = {...board[r][c]};
                    pieceCopy.board = boardCopy;
                    
                    boardCopy[r][c] = pieceCopy;
                }
            }
        }
        boardHistory[turn] = boardCopy;
        // console.log(boardHistory,2)
        return boardCopy;
    }

    const constructors = {
        '': Pawn,
        'R': Rook,
        'N': Knight,
        'B': Bishop,
        'E': Empress,
        'K': King,
        'P': Princess,
        'Q': Queen,
    }
    function undo(){
        if(turn>1){
            let copy = boardHistory[turn-1];

            for(let r=0;r<copy.length;r++){
                for(let c=0;c<copy[0].length;c++){
                    if(!copy[r][c]){
                        theBoard[r][c] = null;
                    } else {
                        let pieceCopy = {...copy[r][c]};
                        theBoard[r][c] = new constructors[pieceCopy.letter](pieceCopy.color,theBoard,[r,c],pieceCopy.hasMoved);
                    }
                }
            }
            setTurn(turn-1);
            setNumPieces(calculateNumPieces(copy))
            moveLog.pop();
        } else {
            console.error("Can't undo any more.");
        }
    }

    function handlePieceMove(piece, newPosition){
        let thisMove = ''
        let oldRow = piece.position[0];
        let oldCol = piece.position[1];
        thisMove += piece.letter;
        
        if( piece.canMove(newPosition) && piece.color === colors[turn%2] ){
            
            copyBoard(theBoard);
            const move = piece.move(newPosition);
            if(move[0]) {

                const numberOfPiecesOnBoard = calculateNumPieces(theBoard);
                setNumPieces(numberOfPiecesOnBoard);     
                const kingInCheck = isKingInCheck(theBoard);
                
                if (numberOfPiecesOnBoard !== numPieces) {
                  kingInCheck ? checkAudio.play() : captureAudio.play();
                  thisMove += !piece.letter ? cols[oldCol] : '';
                  thisMove += 'x';
                } else {
                  kingInCheck ? checkAudio.play() : 
                  move[1] ? castleAudio.play() : moveAudio.play();
                }
                thisMove += cols[newPosition[1]];
                thisMove += rows[newPosition[0]];
                moveLog.push(thisMove);

                setTurn(turn+1);
            }
        } else {
            // handle error
            console.error('Illegal Move')
        }
    }      

    function isKingInCheck(board) {
        const king = board.flat().find((piece) => piece instanceof King && piece.inCheck(piece.position[0], piece.position[1]));
        if (king) {
            king.image = (king.color === 'white') ? whiteKingChecked :
            (king.color === 'black') ? blackKingChecked : king.image;
            return true;
        }
        return false;          
    }

    function calculateNumPieces(board) {
        return board.reduce((count, row) => {
          return count + row.filter(square => square != null).length;
        }, 0);
    }

    function isStalemate(board, kingInCheck){ // stalemate checkmate
        if(!kingInCheck){
            const color = colors[turn%2];
            for(let rank = 0; rank < 8; rank++){
                for(let file = 0; file < 10; file++){
                    let piece = null;
                    if(board[rank][file]) piece = board[rank][file];
                    if(piece && piece.color === color){
                        let availableMoves = piece.availableMoves();
                        for(let i = 0; i < availableMoves.length; i++){
                            const[row, col] = availableMoves[i];
                            if(!piece.inCheck()) {  
                                return false;
                            }
                        }
                    }
                }
            }
        }
        else{
            return false;
        }
        return true;
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

    let destinationSquare = null;
    function selectMove(e){
        if(originSquare){
            destinationSquare = e.target.id.split(',').map((str)=>parseInt(str));
            handlePieceMove(theBoard[originSquare[0]][originSquare[1]], destinationSquare)
        }
        originSquare = null;
    }

    function flipBoard(){
        setIsFlipped(!isFlipped);
    }

    function formatMoves(moveLog){ 
        const rows = [];
        for(let i=0;i<moveLog.length;i+=2){
            rows.push([1+(i/2),moveLog[i],moveLog[i+1]])
        }
        return rows;
    }

    return(
        <> 
            <Navbar />
            <h1>Turn is {turn}.</h1>
            <h1>It's {colors[turn%2]}'s turn.</h1>
            <button onClick={flipBoard}>Flip</button>
            <button onClick={undo}>Undo</button>
            <div className='move-log-holder'>
                <div className={`my-component ${isFlipped ? 'flip' : ''}`}>
                    {theBoard.map((theRow,rowIdx)=>{
                        return <div className="row" key={rowIdx}>
                            {theRow.map( (theCol,colIdx)=>{
                                return <div 
                                            className={` tile ${colors[(rowIdx+colIdx+1)%2]} ${theBoard[rowIdx][colIdx] ? "has-piece" : ""} ${isFlipped ? 'flip' : ''}`}
                                            id={[rowIdx,colIdx]} key={colIdx}
                                            onMouseDown={selectPiece}
                                            onMouseUp={selectMove}
                                        >
                                    {theBoard[rowIdx][colIdx] ? <img src={theBoard[rowIdx][colIdx].image}></img> : ''}
                                    {colIdx ===  (isFlipped ? 0 : 9) ? <div className={`notation number ${(isFlipped ? (rowIdx % 2 === 1) : (rowIdx % 2 === 0)) ? 'light-sq-notation-color' : 'dark-sq-notation-color'}`}>{rows[rowIdx]}</div> : ''}
                                    {rowIdx ===  (isFlipped ? 0 : 7) ? <div className={`notation letter ${(isFlipped ? (colIdx % 2 === 1) : (colIdx % 2 === 0)) ? 'light-sq-notation-color' : 'dark-sq-notation-color'}`}>{cols[colIdx]}</div> : ''}
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