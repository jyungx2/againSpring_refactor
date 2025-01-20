// CartContext.jsx
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItemsList, setCartItemsList] = useState([]);

  const addToCart = (item) => {
    setCartItemsList((prev) => [...prev, item]);
  };

  return (
    <CartContext.Provider value={{ cartItemsList, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
