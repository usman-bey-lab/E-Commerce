import React from "react";
import "./Footer.css";
import footer_logo from "../Assets/logo_big.png";
import instagram_icon from "../Assets/instagram_icon.png";
import pintester_icon from "../Assets/pintester_icon.png";
import whatsapp_icon from "../Assets/whatsapp_icon.png";
import { Link } from "react-router-dom";

const FOOTER_LINKS = ["Company", "Products", "Offices", "About", "Contact"];

const SOCIAL = [
  { icon: instagram_icon, label: "Instagram" },
  { icon: pintester_icon, label: "Pinterest" },
  { icon: whatsapp_icon,  label: "WhatsApp"  },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* ── Brand ── */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src={footer_logo} alt="Shopper" />
            <span>SHOPPER</span>
          </Link>
          <p className="footer-tagline">Style that speaks for itself.</p>
        </div>

        {/* ── Quick Links ── */}
        <nav className="footer-nav">
          <p className="footer-col-title">Quick Links</p>
          <ul>
            {FOOTER_LINKS.map((label) => (
              <li key={label}>
                <a href="#">{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Social ── */}
        <div className="footer-social">
          <p className="footer-col-title">Follow Us</p>
          <div className="footer-social-icons">
            {SOCIAL.map(({ icon, label }) => (
              <a key={label} href="#" aria-label={label} className="footer-social-btn">
                <img src={icon} alt={label} />
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <hr />
        <p>© 2026 Shopper. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;