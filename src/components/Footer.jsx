import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer id="jobnest-footer">
      <p className="footer-copyright">
        © {new Date().getFullYear()} JobNest. All rights reserved.
      </p>

      <nav className="footer-nav" aria-label="Footer navigation">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/Terms-and-Conditions">Terms & Conditions</Link>
        <Link to="/faq">FAQ</Link>
      </nav>
    </footer>
  );
}

export default Footer;
