"use client";
import React, { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 301; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [promoDiscount, setPromoDiscount] = useState(0);

  const clearCart = () => {
    setCartItems(getDefaultCart());
    // Also clear on backend
    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/clearcart", {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
      });
    }
  };

  useEffect(() => {
    fetch("http://localhost:4000/allproducts")
      .then((response) => response.json())
      .then((data) => setAll_Product(data));

    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/getcart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })
        .then((response) => response.json())
        .then((data) => setCartItems(data));
    }
  }, []);

 const addToCart = (itemId, size) => {
  if (!localStorage.getItem("auth-token")) {
    window.location.replace("/login");
    return;
  }

  // Use itemId_size as key so same product in different sizes are tracked separately
  const cartKey = `${itemId}_${size}`;

  setCartItems((prev) => ({ 
    ...prev, 
    [cartKey]: (prev[cartKey] || 0) + 1 
  }));

  fetch("http://localhost:4000/addtocart", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "auth-token": localStorage.getItem("auth-token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ itemId, size }),
  })
  .then(r => r.json())
  .then(data => console.log(data))


    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

    fetch("http://localhost:4000/addtocart", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  const removeFromCart = (itemId, size) => {
  if (!localStorage.getItem("auth-token")) {
    window.location.replace("/login");
    return;
  }

  const cartKey = `${itemId}_${size}`;

  setCartItems((prev) => ({ 
    ...prev, 
    [cartKey]: Math.max((prev[cartKey] || 0) - 1, 0)
  }));

  fetch("http://localhost:4000/removefromcart", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "auth-token": localStorage.getItem("auth-token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ itemId, size }),
  })
  .then(r => r.json())
  .then(data => console.log(data))


    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    fetch("http://localhost:4000/removefromcart", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

 const getTotalCartAmount = () => {
  let totalAmount = 0;
  for (const key in cartItems) {
    // Only count new format keys (itemId_size)
    if (key.includes('_') && cartItems[key] > 0) {
      const itemId = Number(key.split('_')[0]);
      let itemInfo = all_product.find(product => product.id === itemId);
      if (itemInfo) {
        totalAmount += cartItems[key] * itemInfo.new_price;
      }
    }
  }
  return totalAmount;
}
  

  const getTotalCartItems = () => {
  let totalItem = 0;
  for (const key in cartItems) {
    // Only count new format keys (itemId_size)
    if (key.includes('_') && cartItems[key] > 0) {
      totalItem += cartItems[key];
    }
  }
  return totalItem;
}

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
    clearCart,
    promoDiscount,
    setPromoDiscount,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export { ShopContextProvider };
