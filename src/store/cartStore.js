import { create } from "zustand";
import axios from "axios";

export const cartStore = create((set) => ({
  cartItemsList: [],
  shippingCost: 3000,
  fetchCartItems: async () => {
    try {
      const response = await axios.get("https://11.fesp.shop/carts/local");
      const products = response.data.products.map((product) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        image: product.image.url,
      }));
      set({ cartItemsList: products });
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  },
}));
