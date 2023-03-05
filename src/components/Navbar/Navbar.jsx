import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-title">Gothic Chess</div>
      <div className="navbar-buttons">
        <button className="navbar-button">ABOUT</button>
        <button className="navbar-button">HOW TO PLAY</button>
        <button className="navbar-button">REPO</button>
      </div>
    </nav>
  );
}

export default Navbar;