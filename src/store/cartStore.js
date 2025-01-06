import { create } from "zustand";

export const cartStore = create((set) => ({
  cartItemsList: [
    {
      id: 1,
      name: "상품 A",
      price: 125000,
      quantity: 1,
      image: "https://via.placeholder.com/80",
      isSelected: false, // 선택 상태 추가
    },
    {
      id: 2,
      name: "상품 B",
      price: 2500000,
      quantity: 2,
      image: "https://via.placeholder.com/80",
      isSelected: false, // 선택 상태 추가
    },
    {
      id: 3,
      name: "상품 C",
      price: 10000,
      quantity: 1,
      image: "https://via.placeholder.com/80",
      isSelected: false, // 선택 상태 추가
    },
  ],
  shippingCost: 3000,

  setCartItems: (items) => set({ cartItemsList: items }),
  toggleItemSelection: (id) =>
    set((state) => ({
      cartItemsList: state.cartItemsList.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      ),
    })),
}));
