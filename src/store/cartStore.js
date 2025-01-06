import { create } from "zustand";

export const cartStore = create(() => ({
  cartItemsList: [
    {
      id: 1,
      name: "상품 A",
      price: 125000,
      quantity: 1,
      image: "https://via.placeholder.com/80",
    },
    {
      id: 2,
      name: "상품 B",
      price: 2500000,
      quantity: 2,
      image: "https://via.placeholder.com/80",
    },
    {
      id: 3,
      name: "상품 C",
      price: 10000,
      quantity: 1,
      image: "https://via.placeholder.com/80",
    },
  ],
  shippingCost: 3000,
}));
