import { create } from "zustand";
import useAxiosInstance from "../hooks/useAxiosInstance";

export const cartStore = create((set) => {
  const axiosInstance = useAxiosInstance();

  return {
    cartItemsList: [],
    shippingCost: 3000, // 기본 배송비
    loading: false,
    error: null,
    fetchCartItems: async () => {
      set({ loading: true, error: null });
      try {
        const response = await axiosInstance.get("/carts/");

        const products = response.data.item.map((product) => ({
          id: product.product._id,
          name: product.product.name,
          price: product.product.price,
          quantity: product.quantity,
          image: product.product.image.url,
        }));

        set({
          cartItemsList: products,
          shippingCost: response.data.cost.shippingFees,
          loading: false,
        });
      } catch (error) {
        console.error(
          "Error fetching cart items:",
          error.response?.data || error
        );
        set({
          loading: false,
          error: "장바구니 아이템을 가져오는 데 실패했습니다.",
        });
      }
    },
  };
});
