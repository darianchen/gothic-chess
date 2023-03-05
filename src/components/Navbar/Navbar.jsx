import { useState } from 'react';
import Modal from '../Modal';
import './Navbar.css';

function Navbar() {
    const [openAboutModal, setOpenAboutModal] = useState(false);
    const [openHowToPlayModal, setOpenHowToPlayModal] = useState(false);


    return (
        <>        
            <nav className="navbar">
                <div className="navbar-title">Gothic Chess</div>
                <div className="navbar-buttons">
                <button className="navbar-button" onClick={() => {setOpenAboutModal(true)}}>ABOUT</button>
                <button className="navbar-button" onClick={() => {setOpenHowToPlayModal(true)}}>HOW TO PLAY</button>
                <button className="navbar-button">REPO</button>
                </div>
            </nav>
            {openAboutModal && <Modal setOpenModal={setOpenAboutModal} modalType="ABOUT" />}
            {openHowToPlayModal && <Modal setOpenModal={setOpenHowToPlayModal} modalType="HOW TO PLAY" />}
        </>
    );
}

export default Navbar;