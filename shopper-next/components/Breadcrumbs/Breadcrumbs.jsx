import React from "react";
import "./Breadcrumbs.css";
import Link from 'next/link'

const Breadcrums = (props) => {
  const { product } = props;

  const categoryPath = `/${product.category}s`; // mens, womens, kids

  return (
    <nav className="breadcrum" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      <span className="breadcrum-sep">/</span>
      <Link href="/shop">Shop</Link>
      <span className="breadcrum-sep">/</span>
      <Link href={categoryPath}>{product.category}</Link>
      <span className="breadcrum-sep">/</span>
      <span className="breadcrum-current">{product.name}</span>
    </nav>
  );
};

export default Breadcrums;