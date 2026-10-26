import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <header id="jobnest-header">
        <div id="header-logo-container">
          <Link to="/" className="header-logo-link">
            <img
              src="../assets/images/jobnest-header-desktop.png"
              alt="jobnest header logo"
              className="header-logo-img"
            />
          </Link>
        </div>
        <nav className="header-navbar-container" aria-label="Main navigation">
          <ul>
            <li>
              <Link to="/">Find Jobs</Link>
            </li>
            <li>
              <Link to="/saved-jobs">Saved Jobs</Link>
            </li>
            <li>
              <Link to="/track-jobs">Track Jobs</Link>
            </li>
          </ul>
        </nav>
        <div className="header-authentication-container">
          <button className="header-authentication-btn" type="button">
            Log in / Register
          </button>
        </div>
      </header>
    </>
  );
}

export default Header;
