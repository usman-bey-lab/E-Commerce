import React from "react";
import "./Item.css";
import Link from 'next/link'


const Item = ({ id, name, image, new_price, old_price }) => {
  const discount = Math.round(((old_price - new_price) / old_price) * 100);

  return (
    <Link
      href={`/product/${id}`}
      className="item"
    >
      <div className="item-img-wrapper">
        <img src={image} alt={name} />
        {discount > 0 && (
          <span className="item-badge">-{discount}%</span>
        )}
      </div>
      <div className="item-info">
        <p className="item-name">{name}</p>
        <div className="item-prices">
          <span className="item-price-new">${new_price}</span>
          <span className="item-price-old">${old_price}</span>
        </div>
      </div>
    </Link>
  );
};

export default Item;