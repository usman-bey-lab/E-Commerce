import React from "react";
import "./Navbar.css";
import navlogo from "../../assets/nav-logo.svg";
import navProfile from "../../assets/nav-profile.svg";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={navlogo} alt="Shopper Admin" className="nav-logo" />
        <span className="nav-admin-badge">Admin</span>
      </div>
      <div className="navbar-right">
        <div className="nav-profile-wrapper">
          <img src={navProfile} alt="Profile" className="nav-profile" />
          <span className="nav-status-dot"></span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
