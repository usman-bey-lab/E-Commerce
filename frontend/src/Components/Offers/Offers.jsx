import React from "react";
import "./Offers.css";
import exclusive_image from "../Assets/exclusive_image.png";
import { Link } from "react-router-dom";

const Offers = () => {
  return (
    <section className="offers">
      <div className="offers-left">
        <p className="offers-tag">Limited Time</p>
        <h2>
          Exclusive Offers<br />For You
        </h2>
        <p className="offers-sub">Only on best seller products</p>
        <Link to="/womens" className="offers-btn">
          Shop Now
        </Link>
      </div>

      <div className="offers-right">
        <img src={exclusive_image} alt="Exclusive offers" />
      </div>
    </section>
  );
};

export default Offers;