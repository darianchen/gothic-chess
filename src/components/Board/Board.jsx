import { useEffect, useRef, useState } from 'react';

import King from '../../classes/King'; 
import Rook from '../../classes/Rook';
import Queen from '../../classes/Queen';
import Princess from '../../classes/Princess';
import Empress from '../../classes/Empress';
import Pawn from '../../classes/Pawn';
import Knight from '../../classes/Knight';
import Bishop from '../../classes/Bishop';
import captureAudioFile from '../../assets/Audio/capture.mp3';
import moveAudioFile from '../../assets/Audio/move.mp3';
import castleAudioFile from '../../assets/Audio/castle.mp3';
import checkAudioFile from '../../assets/Audio/check.mp3';
import stalemateAudioFile from '../../assets/Audio/stalemate.mp3';
import checkmateAudioFile from '../../assets/Audio/checkmate.mp3';

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
    const captureAudio = new Audio(captureAudioFile);
    const moveAudio = new Audio(moveAudioFile);
    const castleAudio = new Audio(castleAudioFile);
    const checkAudio = new Audio(checkAudioFile);
    const stalemateAudio = new Audio(stalemateAudioFile);
    const checkmateAudio = new Audio(checkmateAudioFile);
    const tileRefs = useRef(Array.from({ length: theBoard.length }, () => []));
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [selectedPiece, setSelectedPiece] = useState(null); 

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", selectMove);
        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", selectMove);
        };
      });


    useEffect(() => {
        setTimeout(tryAiMove,1000);
    },[turn])

    let boardHistory = props.boardHistory;
    let movePositions = props.movePositions;

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
            setNumPieces(calculateNumPieces(copy));
            highlightMove(movePositions[movePositions.length - 2][0], movePositions[movePositions.length - 2][1], true);
            movePositions.pop();
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
                    const pieceCopy = {...copy[r][c]};
                    const { letter, color, hasMoved, prevPos } = pieceCopy;
                    if (letter === '') {
                      theBoard[r][c] = new constructors[letter](color, theBoard, [r, c], hasMoved, prevPos);
                    } else {
                      theBoard[r][c] = new constructors[letter](color, theBoard, [r, c], hasMoved);
                    }                    
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
            movePositions.push([piece.position,newPosition]);
            copyBoard(theBoard);
            highlightMove(piece.position,newPosition);
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
                    isKingInCheck(theBoard,1); 
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

    function isKingInCheck(board, checkOther = 0) {
        const king = board.flat().find((piece) => piece instanceof King && piece.color !== colors[(turn+checkOther)%2]);
        if (king) {
            if(king.inCheck(king.position[0],king.position[1])){
                tileRefs.current[king.position[0]][king.position[1]].classList.add('check');
                return true;
            } else {
                tileRefs.current[king.position[0]][king.position[1]].classList.remove('check');
                return false;
            }
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

    //let originSquare= null;
    const originSquareRef = useRef(null);
    let originalPosition = null;

    function selectPiece(e){
        e.preventDefault();

        setDragging(true);
        setPosition({ x: e.clientX, y: e.clientY });
        if((colors[turn%2]==='white'&&whiteAi)||(colors[turn%2]==='black'&&blackAi)) return; // Prevent human from taking AI turn
        // if(!originSquare) originSquare = e.target.id.split(',').map((str)=>parseInt(str));
        if(!originSquareRef.current && e.target && e.target.childNodes && e.target.childNodes[0]) { 
            const selectedPiece = e.target.childNodes[0];
            setSelectedPiece(selectedPiece);
            originalPosition = { x: selectedPiece.offsetLeft, y: selectedPiece.offsetTop };
            originSquareRef.current = JSON.parse(e.target.childNodes[0].getAttribute("data-pos")); 
        }
        else  {
            originSquareRef.current = JSON.parse(e.target.id);
        }
        setDragging(true);
        if(!theBoard[originSquareRef.current[0]][originSquareRef.current[1]]) originSquareRef.current = null;
    }

    let destinationSquare = null;
    function selectMove(e) {
      setDragging(false);
      
      if (originSquareRef.current) {
        try {
          destinationSquare = JSON.parse(e.target.id);
        } catch (error) {
          resetPiecePosition();
          originSquareRef.current = null;
          return;
        }
    
        if (JSON.stringify(originSquareRef.current) !== JSON.stringify(destinationSquare)) {
          const isMoveValid = handlePieceMove(theBoard[originSquareRef.current[0]][originSquareRef.current[1]], destinationSquare);
          if ((originSquareRef.current === destinationSquare) || !isMoveValid) {
            resetPiecePosition();
          }
        } else {
          resetPiecePosition();
        }           
      }
      originSquareRef.current = null;
    }
    
    function resetPiecePosition() {
      setPosition({ x: 0, y: 0 });
      setSelectedPiece(null);
      selectedPiece.style.left = "0px";
      selectedPiece.style.top = "0px";
    }
    
    const handleMouseMove = (e) => {
        if (dragging) {
            document.body.style.cursor = 'grabbing';
            const dx = e.clientX - position.x;
            const dy = e.clientY - position.y;
            setPosition({ x: e.clientX, y: e.clientY });
          // update the position of the image
          if(selectPiece){
            selectedPiece.style.left = selectedPiece.offsetLeft + dx + "px";
            selectedPiece.style.top = selectedPiece.offsetTop + dy + "px";
          }
        }
    };

    // let clickedSquare = useRef(null);
    // function clickPiece(e) {
    //     if(!clickedSquare.current && e.target && e.target.childNodes && e.target.childNodes[0]) { 
    //         const [row,col] = JSON.parse(e.target.childNodes[0].getAttribute("data-pos"));
    //         clickedSquare.current = [row,col];
    //     } else{
    //         const [row,col] = JSON.parse(e.target.id);
    //         handlePieceMove(theBoard[clickedSquare.current[0]][clickedSquare[1]], [row,col]);
    //     }
    // }

    function formatMoves(moveLog){ 
        const rows = [];
        for(let i=0;i<moveLog.length;i+=2){
            rows.push([1+(i/2),moveLog[i],moveLog[i+1]])
        }
        return rows;
    }

    function highlightMove(oldPositions,newPosition, undo = false){
        const [oldRow, oldCol] = oldPositions;
        const [newRow, newCol] = newPosition;
        const dark = '#ADD8E6';
        const light = '#99c2ff';

        if(turn > 1){ // removes the highlight from the previous move or current if undo
            const deleteIdx = undo === false ? 2 : 1;
            tileRefs.current[movePositions[movePositions.length - deleteIdx][0][0]][movePositions[movePositions.length - deleteIdx][0][1]].style.backgroundColor = '';
            tileRefs.current[movePositions[movePositions.length - deleteIdx][1][0]][movePositions[movePositions.length - deleteIdx][1][1]].style.backgroundColor = '';
        }

        if(movePositions.length > 1){
            tileRefs.current[oldRow][oldCol].style.backgroundColor = (oldRow + oldCol) % 2 === 0 ? light : dark;
            tileRefs.current[newRow][newCol].style.backgroundColor = (newRow + newCol) % 2 === 0 ? light : dark;
        }   
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
                                            id={`[${rowIdx},${colIdx}]`} key={colIdx}
                                            onMouseDown={selectPiece}
                                            onMouseUp={selectMove}
                                            // onClick={clickPiece}
                                            ref={(el) => (tileRefs.current[rowIdx][colIdx] = el)}
                                        >
                                    {theBoard[rowIdx][colIdx] && <img src={theBoard[rowIdx][colIdx].image}  data-pos={`[${rowIdx},${colIdx}]`}/>}
                                    {colIdx ===  (isFlipped ? 0 : 9) ? <div className={`notation number ${(isFlipped ? (rowIdx % 2 === 1) : (rowIdx % 2 === 0)) ? 'light-sq-notation-color' : 'dark-sq-notation-color'}`}>{rows[rowIdx]}</div> : ''}
                                    {rowIdx ===  (isFlipped ? 0 : 7) ? <div className={`notation letter ${(isFlipped ? (colIdx % 2 === 1) : (colIdx % 2 === 0)) ? 'light-sq-notation-color' : 'dark-sq-notation-color'}`}>{cols[colIdx]}</div> : ''}
                                </div>
                            })}
                        </div>
                    })}
                </div>
                <div id='controls-and-movelog'>
                    <div id='board-controls' >
                        <label><input type="checkbox" onChange={() => setWhiteAi(b => !b)}/>White AI</label>
                        <label><input type="checkbox" onChange={() => setBlackAi(b => !b)} defaultChecked={true}/>Black AI</label>
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