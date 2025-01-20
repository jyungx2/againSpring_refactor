import { create } from "zustand";

const useCartStore = create((set) => ({
  cartItems: [], // 장바구니 상품 초기 상태
  addToCart: (product) =>
    set((state) => ({
      cartItems: [...state.cartItems, product],
    })),
}));

export default useCartStore;
