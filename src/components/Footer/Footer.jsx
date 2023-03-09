const Footer = () => {
  return (
    <footer className="footer-container">
        <div className="footer-developers">
            <div className="developer">
                <p className="developer-name">Darian Chen</p>
                <div className="social-links">
                    <a href="https://github.com/darianchen" target="_blank"><i className="fab fa-github"></i></a>
                    <a href="https://www.linkedin.com/in/darianchen/" target="_blank"><i className="fab fa-linkedin"></i></a>
                </div>
            </div>
            <div className="developer">
                <p className="developer-name">Brian Lam</p>
                <div className="social-links">
                    <a href="https://github.com/cb299792458" target="_blank"><i className="fab fa-github"></i></a>
                    <a href="https://www.linkedin.com/in/brian-lam-software-developer/" target="_blank"><i className="fab fa-linkedin"></i></a>
                </div>
            </div>
        </div>
        <div className="footer-extra">
            <p>Made with React <i className="fab fa-react"></i></p>
        </div>
    </footer>
  );
};

export default Footer;