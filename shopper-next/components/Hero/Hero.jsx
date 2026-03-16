import React from "react";
import Link from 'next/link'
import "./Hero.css";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-left">

        <span className="hero-tag">New Arrivals Only</span>

        <h1 className="hero-heading">
          <span className="hero-heading-line">
            new <img src="/Assets/hand_icon.png" alt="" className="hero-hand" />
          </span>
          <span>collections</span>
          <span>for everyone</span>
        </h1>

        <Link href="/womens" className="hero-btn">
          Latest Collection
          <img src="/Assets/arrow.png" alt="" />
        </Link>

      </div>

      <div className="hero-right">
         <img src="/Assets/hero_image.png" alt="Latest fashion collection" className="hero-img" />  
      </div>
    </div>
  );
};

export default Hero;