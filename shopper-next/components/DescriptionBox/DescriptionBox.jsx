'use client'
import React, { useState } from "react";
import "./DescriptionBox.css";

const DescriptionBox = () => {
  return (
    <div className="descriptionbox">

      {/* ── Tab header ── */}
      <div className="descriptionbox-tabs">
        <button className="descriptionbox-tab active">
          Description
        </button>
      </div>

      {/* ── Content ── */}
      <div className="descriptionbox-content">
        <p>
          An e-commerce website is an online platform that facilitates the
          buying and selling of products or services over the internet. It
          serves as a virtual marketplace where businesses and individuals
          can showcase their products, interact with customers, and conduct
          transactions without the need for a physical presence.
        </p>
        <p>
          Products are displayed with detailed descriptions, images, prices,
          and available variations such as sizes and colors. Each product
          has its own dedicated page with all relevant information to help
          customers make informed decisions.
        </p>
      </div>

    </div>
  );
};

export default DescriptionBox;