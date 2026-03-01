import React from "react";
import "./Breadcrums.css";
import { Link } from "react-router-dom";

const Breadcrums = (props) => {
  const { product } = props;

  const categoryPath = `/${product.category}s`; // mens, womens, kids

  return (
    <nav className="breadcrum" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      <span className="breadcrum-sep">/</span>
      <Link to="/shop">Shop</Link>
      <span className="breadcrum-sep">/</span>
      <Link to={categoryPath}>{product.category}</Link>
      <span className="breadcrum-sep">/</span>
      <span className="breadcrum-current">{product.name}</span>
    </nav>
  );
};

export default Breadcrums;