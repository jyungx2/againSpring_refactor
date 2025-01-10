import { create } from "zustand";
import useAxiosInstance from "../hooks/useAxiosInstance";
import useUserStore from "@store/userStore";

export const cartStore = create((set) => {
  const axiosInstance = useAxiosInstance();

  return {
    cartItemsList: [],
    shippingCost: 0,
    loading: false,
    error: null,
    fetchCartItems: async () => {
      set({ loading: true, error: null });

      const { user } = useUserStore.getState();

      try {
        const response = await axiosInstance.get("/carts/", {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        const products = response.data.item.map((item) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image.url,
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
