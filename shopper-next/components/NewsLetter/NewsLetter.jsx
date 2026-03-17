"use client";
import React, { useState } from "react";
import "./NewsLetter.css";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="newsletter">
      <div className="newsletter-inner">
        {submitted ? (
          <div className="newsletter-success">
            <span>✓</span>
            <p>You're subscribed! Check your inbox soon.</p>
          </div>
        ) : (
          <>
            <p className="newsletter-tag">Newsletter</p>
            <h2>Exclusive offers, straight to your inbox</h2>
            <p className="newsletter-sub">
              Subscribe and be the first to know about new arrivals and deals.
            </p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <button onClick={handleSubmit}>Subscribe</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NewsLetter;
