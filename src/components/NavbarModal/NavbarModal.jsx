function NavbarModal({setOpenModal, modalType}) {
    switch (modalType) {
        case 'ABOUT':
            return(
                <>
                    <div  onClick={() => {setOpenModal(false)}} className="modalBackground">
                        <div onClick={(e) => {e.stopPropagation()}} className="modalContainer" id="aboutModal">
                            <button className="closeBtn" onClick={() => {setOpenModal(false)}}>&times;</button>
                            <div className="modal-title">About</div>
                            <div className="modal-body">Welcome to Gothic Chess! A variant of the timeless game created by Ed Trice in 2000. This chess variant brings a twist on the game we all know and love.
                            Gothic Chess introduces a unique gameplay experience with an expansive 80-square board and the addition of two new pieces - the Chancellor, capable of moving like a Knight or Rook, and the Archbishop, capable of moving like a Knight or Bishop.
                            This web app was built using React and vanilla JavaScript. Future updates will include an online multiplayer function and the ability to play against the computer. <span style={{ fontWeight: 'bold', color: '#007FFF' }}>Stay tuned!</span>
    
                            </div>
                        </div>
                    </div>
                </>
            )
        case 'HOW TO PLAY':
            return (
                <>
                  <div onClick={() => { setOpenModal(false) }} className="modalBackground">
                    <div onClick={(e) => { e.stopPropagation() }} className="modalContainer" id="how-to-play">
                      <button className="closeBtn" onClick={() => { setOpenModal(false) }}>&times;</button>
                      <div className="modal-title">How to Play</div>
                      <div className="modal-body">
                        <p>Just like regular chess, Gothic Chess is a two-player game where the objective is to checkmate the opponent's king.
                        Gothic Chess adds two new pieces to the game: the Princess and the Empress. The Empress moves like a Bishop and a Knight combined, and the Chancellor moves like a Rook and a Knight combined.
                        </p>
                        <div id="new-piece-container">
                            <img src="src/assets/Images/princesses.png" alt="Princess"/>
                            <img src="src/assets/Images/empresses.png" alt="Empress"/>
                        </div>
                        <p>The game also has a different castling rule. In Gothic Chess, the King moves three squares in either direction, and the Rook moves to the square adjacent to the King.</p>
                      </div>
                    </div>
                  </div>
                </>
            )
      }
}

export default NavbarModal;