function GameOverModal({ result,color,setGameOverModal }) {
    switch (result) {
        case 'CHECKMATE':
            return(
                <>
                    <div  onClick={() => {setGameOverModal(false)}} className="modalBackground">
                        <div onClick={(e) => {e.stopPropagation()}} className="modalContainer" id="aboutModal">
                            <button className="closeBtn" onClick={() => {setGameOverModal(false)}}>&times;</button>
                            <div className="modal-title">{color === 'white' ? 'Black' : 'White'} won the game!</div>
                            <button onClick={() =>{window.location.reload(true);}}>Play again?</button>
                        </div>
                    </div>
                </>
            )
        case 'STALEMATE':
            return(
                <>
                    <div  onClick={() => {setGameOverModal(false)}} className="modalBackground">
                        <div onClick={(e) => {e.stopPropagation()}} className="modalContainer" id="aboutModal">
                            <button className="closeBtn" onClick={() => {setGameOverModal(false)}}>&times;</button>
                            <div className="modal-title">The game has ended in a stalemate</div>
                            <button onClick={() =>{window.location.reload(true);}}>Play again?</button>
                        </div>
                    </div>
                </>
            )
        default:
          return "Unknown game result.";
      }
}

export default GameOverModal;