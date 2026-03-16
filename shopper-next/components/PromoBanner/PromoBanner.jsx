'use client'
import React, { useState, useEffect } from "react";
import "./PromoBanner.css";

// Countdown target — 12 hours from now
const getTarget = () => new Date(Date.now() + 12 * 60 * 60 * 1000);

const PromoBanner = ({ category, banner }) => {
  const [target] = useState(getTarget);
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const pad = (n) => String(n).padStart(2, "0");

  // Category label
  const label = category === "men" ? "Men's"
    : category === "women" ? "Women's"
    : category === "kid"   ? "Kids'"
    : "";

  return (
    <div className="promo-banner">
      {/* Left content */}
      <div className="promo-left">
        <p className="promo-tag">Limited Time Deal</p>
        <h2 className="promo-heading">
          Flat <span>50% Off</span>
        </h2>
        <p className="promo-sub">On {label} Best Sellers</p>

        {/* Countdown */}
        <div className="promo-countdown">
          <div className="promo-time-block">
            <span className="promo-time-num">{pad(timeLeft.h)}</span>
            <span className="promo-time-label">Hrs</span>
          </div>
          <span className="promo-colon">:</span>
          <div className="promo-time-block">
            <span className="promo-time-num">{pad(timeLeft.m)}</span>
            <span className="promo-time-label">Min</span>
          </div>
          <span className="promo-colon">:</span>
          <div className="promo-time-block">
            <span className="promo-time-num">{pad(timeLeft.s)}</span>
            <span className="promo-time-label">Sec</span>
          </div>
        </div>

        <button className="promo-btn">Explore Now →</button>
      </div>

      {/* Right: banner image */}
      <div className="promo-right">
        <img src={banner} alt={`${label} collection`} />
      </div>
    </div>
  );
};

export default PromoBanner;