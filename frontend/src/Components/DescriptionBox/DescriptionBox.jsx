import React, { useState } from "react";
import "./DescriptionBox.css";

const TABS = ["Description", "Reviews (122)"];

const DescriptionBox = () => {
  const [activeTab, setActiveTab] = useState("Description");

  return (
    <div className="descriptionbox">

      {/* ── Tabs ── */}
      <div className="descriptionbox-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`descriptionbox-tab${activeTab === tab ? " active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="descriptionbox-content">
        {activeTab === "Description" ? (
          <>
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
          </>
        ) : (
          <div className="descriptionbox-reviews-empty">
            <p>No reviews yet. Be the first to review this product.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default DescriptionBox;