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
import GameOverModal from '../GameOverModal';

function Board(props){
    let theBoard = props.board;

    const colors = ['black','white'];
    const rows = [8,7,6,5,4,3,2,1];
    const cols = 'abcdefghij'.split('');
    const moveLog = props.moveLog;
    const [turn, setTurn] = useState(1);
    const [isFlipped, setIsFlipped] = useState(false);
    const [numPieces, setNumPieces] = useState(40);
    const [whiteAi, setWhiteAi] = useState(false);
    const [blackAi, setBlackAi] = useState(true);
    const [openGameOverModal, setGameOverModal] = useState(false);
    const [result, setResult] = useState('');
    const captureAudio = new Audio('https://raw.githubusercontent.com/darianchen/gothic-chess/main/src/assets/Audio/capture.mp3');
    const moveAudio = new Audio('https://raw.githubusercontent.com/darianchen/gothic-chess/main/src/assets/Audio/move.mp3');
    const castleAudio = new Audio('https://raw.githubusercontent.com/darianchen/gothic-chess/main/src/assets/Audio/castle.mp3');
    const checkAudio = new Audio('https://raw.githubusercontent.com/darianchen/gothic-chess/main/src/assets/Audio/check.mp3');
    const stalemateAudio = new Audio('https://raw.githubusercontent.com/darianchen/gothic-chess/main/src/assets/Audio/stalemate.mp3');
    const checkmateAudio = new Audio('https://raw.githubusercontent.com/darianchen/gothic-chess/main/src/assets/Audio/checkmate.mp3');

    useEffect(() => {
        // if (isStalemate(theBoard, isKingInCheck(theBoard))){
        //     window.alert('Stalemate');
        //     stalemateAudio.play();
        // };
        setTimeout(tryAiMove,1000);
    },[turn])

    let boardHistory = props.boardHistory;

    const aiTurn = () => {
        return (colors[turn%2]==='white'&&whiteAi) || (colors[turn%2]==='black'&&blackAi)
    };

    function copyBoard(board, dontSave = false){
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
        if(!dontSave) boardHistory[turn] = boardCopy;
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
            setBoardTo(copy)

            setTurn(turn-1);
            setNumPieces(calculateNumPieces(copy))
            moveLog.pop();
        } else {
            console.error("Can't undo any more.");
        }
    }

    function setBoardTo(copy){
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
    }

    function handlePieceMove(piece, newPosition){
        let oldRow;
        let oldCol;
        let thisMove = ''
        if(piece){
            oldRow = piece.position[0];
            oldCol = piece.position[1];
            thisMove += piece.letter;
        }
        
        if(piece && piece.canMove(newPosition) && piece.color === colors[turn%2] ){
            
            copyBoard(theBoard);
            
            const move = piece.move(newPosition,true,aiTurn());
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

                let result = findAvailableMoves(colors[(turn+1)%2]);

                if(typeof result === 'string'){
                    setGameOverModal(true);
                    setResult(result);
                } else {    
                    setTurn(turn + 1);
                }
            }
        } else {
            // handle error
            
            console.error('Illegal Move');

           if(aiTurn()) setTimeout(tryAiMove,1000);
        }
        
    }
    
    function tryAiMove(){
        const currentPlayer = colors[turn%2];
        if((currentPlayer==='white'&&!whiteAi)||(currentPlayer==='black'&&!blackAi)) return;

        const allMoves = findAvailableMoves(currentPlayer);
        if(!allMoves.length) return; // this should go to stalemate/checkmate

        const [randomPiece,randomMove] = allMoves[Math.floor(Math.random()*allMoves.length)];
        // console.log("trying to make move:",randomPiece,randomMove)
        
        handlePieceMove(randomPiece,randomMove);
    }
    
    function findAvailableMoves(color){
        let allMoves = [];
        let currentBoard = copyBoard(theBoard, true);

        for(let r=0;r<theBoard.length;r++){
            for(let c=0;c<theBoard[0].length;c++){
                if(theBoard[r][c]&&theBoard[r][c].color===color){
                    const currentPiece = theBoard[r][c];
                    let oldPos = currentPiece.position;

                    for(let move of currentPiece.availableMoves()){

                        let prevHasMoved = currentPiece.hasMoved;
                        if ((currentPiece.move([move[0], move[1]], false) && !currentPiece.inCheck())) {
                            currentPiece.hasMoved = prevHasMoved;
                            allMoves.push([currentPiece, move]);
                        }
                                  
                        // reset for next test;
                        setBoardTo(currentBoard);
                        currentPiece.position = oldPos;
                        theBoard[r][c] = currentPiece;
                    }
                }
            }
        }
        // console.log(allMoves);
        if(!allMoves.length){
            if(isKingInCheck(theBoard)){
                checkmateAudio.play();
                return 'CHECKMATE';
            } else{
                stalemateAudio.play();
                return 'STALEMATE';
            }
        }
        return allMoves;
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

    // stuff for testing
    window.handlePieceMove = handlePieceMove;
    window.board = theBoard;

    let originSquare= null;
    function selectPiece(e){
        e.preventDefault();
        if((colors[turn%2]==='white'&&whiteAi)||(colors[turn%2]==='black'&&blackAi)) return; // Prevent human from taking AI turn

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

    function formatMoves(moveLog){ 
        const rows = [];
        for(let i=0;i<moveLog.length;i+=2){
            rows.push([1+(i/2),moveLog[i],moveLog[i+1]])
        }
        return rows;
    }

    function handleWhiteChange(e){
        setWhiteAi(b => !b);
    }
    function handleBlackChange(e){
        setBlackAi(b => !b);
    }

    return(
        <> 
            <h1>Turn {turn}, {colors[turn%2]} to move</h1>
            {/* <button onClick={()=>console.log(theBoard)}>Print Board for Debugging</button> */}
            <div id='game-container'>
                <div className={`${isFlipped ? 'flip' : ''}`} id='board'>
                    {theBoard.map((theRow,rowIdx)=>{
                        return <div className="row" key={rowIdx}>
                            {theRow.map( (theCol,colIdx)=>{
                                return <div 
                                            className={` tile ${colors[(rowIdx+colIdx+1)%2]} ${theBoard[rowIdx][colIdx] ? "has-piece" : ""} ${isFlipped ? 'flip' : ''}`}
                                            id={[rowIdx,colIdx]} key={colIdx}
                                            onMouseDown={selectPiece}
                                            onMouseUp={selectMove}
                                            style={{
                                                borderTopLeftRadius: rowIdx === 0 && colIdx === 0 ? '5%' : 0,
                                                borderTopRightRadius: rowIdx === 0 && colIdx === 9 ? '5%' : 0,
                                                borderBottomLeftRadius: rowIdx === 7 && colIdx === 0 ? '5%' : 0,
                                                borderBottomRightRadius: rowIdx === 7 && colIdx === 9 ? '5%' : 0,
                                              }}
                                        >
                                    {theBoard[rowIdx][colIdx] ? <img src={theBoard[rowIdx][colIdx].image}></img> : ''}
                                    {colIdx ===  (isFlipped ? 0 : 9) ? <div className={`notation number ${(isFlipped ? (rowIdx % 2 === 1) : (rowIdx % 2 === 0)) ? 'light-sq-notation-color' : 'dark-sq-notation-color'}`}>{rows[rowIdx]}</div> : ''}
                                    {rowIdx ===  (isFlipped ? 0 : 7) ? <div className={`notation letter ${(isFlipped ? (colIdx % 2 === 1) : (colIdx % 2 === 0)) ? 'light-sq-notation-color' : 'dark-sq-notation-color'}`}>{cols[colIdx]}</div> : ''}
                                </div>
                            })}
                        </div>
                    })}
                </div>
                <div id='controls-and-movelog'>
                    <div id='board-controls' >
                        <label><input type="checkbox" onChange={handleWhiteChange}/>White AI</label>
                        <label><input type="checkbox" onChange={handleBlackChange} defaultChecked={true}/>Black AI</label>
                        <button onClick={() => setIsFlipped(!isFlipped)}>Flip</button>
                        <button onClick={undo}>Undo</button>
                    </div>
                    <MoveLog moveLog={formatMoves(moveLog)} />
                </div>
                {openGameOverModal && <GameOverModal result={result} color={colors[(turn+1)%2]} setGameOverModal={setGameOverModal} />}
            </div>
        </>
    )
};

export default Board;