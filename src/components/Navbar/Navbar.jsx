import { useState } from 'react';
import NavbarModal from '../NavbarModal';
import './Navbar.css';
import GitHubIcon from './GitHubIcon';

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
                <button className="navbar-button" onClick={() => window.open("https://github.com/darianchen/gothic-chess")}><GitHubIcon /> REPO</button>
                </div>
            </nav>
            {openAboutModal && <NavbarModal setOpenModal={setOpenAboutModal} modalType="ABOUT" />}
            {openHowToPlayModal && <NavbarModal setOpenModal={setOpenHowToPlayModal} modalType="HOW TO PLAY" />}
        </>
    );
}

export default Navbar;