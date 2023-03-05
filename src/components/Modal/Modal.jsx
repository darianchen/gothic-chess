function Modal({setOpenModal, modalType}) {

    if(modalType === 'ABOUT'){
        return(
            <>
                <div  onClick={() => {setOpenModal(false)}} className="modalBackground">
                    <div onClick={(e) => {e.stopPropagation()}} className="modalContainer">
                        <button className="closeBtn" onClick={() => {setOpenModal(false)}}>&times;</button>
                        <div className="modal-title">About</div>
                        <div className="modal-body">This is a Gothic Chess App</div>
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