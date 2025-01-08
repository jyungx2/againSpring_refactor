import { create } from "zustand";
import useAxiosInstance from "../hooks/useAxiosInstance";

export const cartStore = create((set) => {
  const axiosInstance = useAxiosInstance();

  return {
    cartItemsList: [],
    shippingCost: 3000,
    loading: false,
    error: null,
    fetchCartItems: async (isLoggedIn) => {
      if (!isLoggedIn) {
        set({
          error: "비회원은 장바구니를 조회할 수 없습니다.",
        });
        return;
      }

      set({ loading: true, error: null });
      try {
        const response = await axiosInstance.get("/carts");

        const products = response.data.item.map((product) => ({
          id: product.product._id,
          name: product.product.name,
          price: product.product.price,
          quantity: product.quantity,
          image: product.product.image.url,
        }));

        set({ cartItemsList: products, loading: false });
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
