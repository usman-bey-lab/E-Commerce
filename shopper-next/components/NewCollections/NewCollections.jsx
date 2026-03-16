'use client'
import React, { useEffect, useState } from "react";
import "./NewCollections.css";
import Item from "@/components/Item/Item";

const NewCollections = () => {
  const [newCollection, setNewCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/newcollection")
      .then((res) => res.json())
      .then((data) => {
        setNewCollection(data);
        setLoading(false);
      });
  }, []);

  return (
    <section className="new-collections">
      <div className="new-collections-header">
        <p className="new-collections-tag">Just Dropped</p>
        <h2>New Collections</h2>
      </div>

      {loading ? (
        <div className="collections-grid">
          {Array(8).fill(null).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : (
        <div className="collections-grid">
          {newCollection.map((item) => (
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
      )}
    </section>
  );
};

export default NewCollections;