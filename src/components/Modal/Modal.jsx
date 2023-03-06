function Modal({setOpenModal, modalType}) {

    if(modalType === 'ABOUT'){
        return(
            <>
                <div  onClick={() => {setOpenModal(false)}} className="modalBackground">
                    <div onClick={(e) => {e.stopPropagation()}} className="modalContainer">
                        <button className="closeBtn" onClick={() => {setOpenModal(false)}}>&times;</button>
                        <div className="modal-title">About</div>
                        <div className="modal-body">Welcome to Gothic Chess! A variant of the timeless game created by Ed Trice in 2000. This chess variant brings a twist on the timeless game we all know and love.
                        Gothic Chess introduces a unique gameplay experience with an expansive 80-square board and the addition of two new pieces - the Chancellor, capable of moving like a Knight or Rook, and the Archbishop, capable of moving like a Knight or Bishop.
                        This web app was built using React and vanilla JavaScript. Future updates will include an online multiplayer function and the ability to play against the computer. <span style={{ fontWeight: 'bold', color: '#007FFF' }}>Stay tuned!</span>

                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return(
            <>
                <div  onClick={() => {setOpenModal(false)}} className="modalBackground">
                    <div onClick={(e) => {e.stopPropagation()}} className="modalContainer">
                        <button className="closeBtn" onClick={() => {setOpenModal(false)}}>&times;</button>
                        <div className="modal-title">How to play</div>
                        <div className="modal-body">This is how to play</div>
                    </div>
                </div>
            </>
        )
    } 
}

export default Modal;