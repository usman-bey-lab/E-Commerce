import React from "react";
import "./Hero.css";
import hand_icon from "../Assets/hand_icon.png";
import arrow_icon from "../Assets/arrow.png";
import hero_image from "../Assets/hero_image.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-left">

        <span className="hero-tag">New Arrivals Only</span>

        <h1 className="hero-heading">
          <span className="hero-heading-line">
            new <img src={hand_icon} alt="" className="hero-hand" />
          </span>
          <span>collections</span>
          <span>for everyone</span>
        </h1>

        <Link to="/womens" className="hero-btn">
          Latest Collection
          <img src={arrow_icon} alt="" />
        </Link>

      </div>

      <div className="hero-right">
        <img src={hero_image} alt="Latest fashion collection" className="hero-img" />
      </div>
    </div>
  );
};

export default Hero;