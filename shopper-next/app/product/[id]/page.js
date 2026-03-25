"use client";
import { use, useContext, useEffect, useState } from "react";
import { ShopContext } from "@/context/ShopContext";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumbs";
import ProductDisplay from "@/components/ProductDisplay/ProductDisplay";
import DescriptionBox from "@/components/DescriptionBox/DescriptionBox";
import RelatedProducts from "@/components/RelatedProducts/RelatedProducts";
import Reviews from "@/components/Reviews/Reviews";

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function ProductPage({ params }) {
  const { id } = use(params);
  const { all_product } = useContext(ShopContext);

  const [avgRating,     setAvgRating]     = useState(0);
  const [totalReviews,  setTotalReviews]  = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // ── Fetch review summary (avg + count) whenever product id changes ──
  useEffect(() => {
    if (!id) return;
    setReviewsLoading(true);
    fetch(`${API}/reviews/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setAvgRating(data.avgRating   ?? 0);
        setTotalReviews(data.totalReviews ?? 0);
      })
      .catch(() => {
        setAvgRating(0);
        setTotalReviews(0);
      })
      .finally(() => setReviewsLoading(false));
  }, [id]);

  // ── Refresh review summary after user submits a review ──
  const refreshRatings = () => {
    fetch(`${API}/reviews/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setAvgRating(data.avgRating   ?? 0);
        setTotalReviews(data.totalReviews ?? 0);
      })
      .catch(() => {});
  };

  // ── Loading state ──
  if (all_product.length === 0) {
    return (
      <div className="product-page-loading">
        Loading...
      </div>
    );
  }

  // ── Product not found ──
  const product = all_product.find((p) => p.id === Number(id));
  if (!product) {
    return (
      <div className="product-page-not-found">
        Product not found.
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb navigation */}
      <Breadcrumb product={product} />

      {/* Main product display with star rating UI */}
      <ProductDisplay
        product={product}
        avgRating={avgRating}
        totalReviews={totalReviews}
        onRate={(star) => setSelectedRating(star)}
        userRating={selectedRating}
      />

      {/* Review form + list — refreshes avg rating after submission */}
      <Reviews
        productId={product.id}
        selectedRating={selectedRating}
        onRatingChange={setSelectedRating}
        onReviewSubmitted={refreshRatings}
      />

      {/* Static product description */}
      <DescriptionBox />

      {/* Related products in same category */}
      <RelatedProducts category={product.category} />
    </div>
  );
}