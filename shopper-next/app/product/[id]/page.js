"use client";
import { use, useContext, useEffect, useState } from "react";
import { ShopContext } from "@/context/ShopContext";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumbs";
import ProductDisplay from "@/components/ProductDisplay/ProductDisplay";
import DescriptionBox from "@/components/DescriptionBox/DescriptionBox";
import RelatedProducts from "@/components/RelatedProducts/RelatedProducts";
import Reviews from "@/components/Reviews/Reviews";

export default function ProductPage({ params }) {
  const { id } = use(params);
  const { all_product } = useContext(ShopContext);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:4000/reviews/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setAvgRating(data.avgRating);
        setTotalReviews(data.totalReviews);
      });
  }, [id]);

  if (all_product.length === 0) return <div>Loading...</div>;

  const product = all_product.find((p) => p.id === Number(id));
  if (!product) return <div>Product not found</div>;

  // ← handleRate defined here, AFTER product is confirmed to exist
  const handleRate = async (star) => {
    if (!localStorage.getItem("auth-token")) return;
    await fetch(`http://localhost:4000/reviews/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify({ rating: star, comment: "⭐" }),
    });
    // Refresh rating after submitting
    fetch(`http://localhost:4000/reviews/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setAvgRating(data.avgRating);
        setTotalReviews(data.totalReviews);
      });
  };

  return (
    <div>
      <Breadcrumb product={product} />
      <ProductDisplay
        product={product}
        avgRating={avgRating}
        totalReviews={totalReviews}
        onRate={(star) => {
          setSelectedRating(star);
        }}
        userRating={selectedRating}
      />
      <Reviews
        productId={product.id}
        selectedRating={selectedRating}
        onRatingChange={setSelectedRating}
      />

      <DescriptionBox />
      <RelatedProducts category={product.category} />
    </div>
  );
}
