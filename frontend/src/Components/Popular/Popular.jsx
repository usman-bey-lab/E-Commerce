import React, { useEffect, useState } from "react";
import "./Popular.css";
import Item from "../Item/Item";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/popularinwomen")
      .then((response) => response.json())
      .then((data) => {
        setPopularProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <section className="popular">
      <div className="popular-header">
        <p className="popular-tag">Trending Now</p>
        <h2>Popular in Women</h2>
      </div>

      <div className="popular-grid">
        {loading
          ? Array(4).fill(null).map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))
          : popularProducts.map((item) => (
              <Item
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            ))}
      </div>
    </section>
  );
};

export default Popular;