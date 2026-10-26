import { NavLink, Link } from "react-router-dom";
import jobnestLogo from "../assets/images/jobnest-header-desktop.png";
import "./Header.css";
import { Search, Bookmark, ClipboardList } from "lucide-react";

function Header() {
  return (
    <header id="jobnest-header">
      <div id="header-logo-container">
        <Link to="/" className="header-logo-link">
          <img
            src={jobnestLogo}
            alt="jobnest header logo"
            className="header-logo-img"
          />
        </Link>
      </div>
      <nav id="header-navbar-container" aria-label="Main navigation">
        <ul id="header-nav-list">
          <li>
            <NavLink to="/" className="header-nav-link">
              <Search size={18} />
              <span>Find Jobs</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/saved-jobs" className="header-nav-link">
              <Bookmark size={18} />
              <span>Saved Jobs</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/track-jobs" className="header-nav-link">
              <ClipboardList size={18} />
              <span>Track Jobs</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="header-authentication-container">
        <button className="header-authentication-btn" type="button">
          Log in / Register
        </button>
      </div>
    </header>
  );
}

export default Header;
