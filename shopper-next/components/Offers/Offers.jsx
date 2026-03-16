import React from "react";
import "./Offers.css";
import Link from 'next/link'

const Offers = () => {
  return (
    <section className="offers">
      <div className="offers-left">
        <p className="offers-tag">Limited Time</p>
        <h2>
          Exclusive Offers<br />For You
        </h2>
        <p className="offers-sub">Only on best seller products</p>
        <Link href="/womens" className="offers-btn">
          Shop Now
        </Link>
      </div>

      <div className="offers-right">
        <img src="/Assets/exclusive_image.png" alt="Exclusive offers" />
      </div>
    </section>
  );
};

export default Offers;