import { create } from "zustand";
import useAxiosInstance from "../hooks/useAxiosInstance";
import useUserStore from "@store/userStore";

export const cartStore = create((set, get) => {
  const axiosInstance = useAxiosInstance();

  const computeTotalOrderAmount = () => {
    const { cartItemsList, shippingCost } = get();
    const totalPrice = cartItemsList.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return totalPrice + shippingCost;
  };

  return {
    cartItemsList: [],
    shippingCost: 0,
    totalOrderAmount: 0,
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
          totalOrderAmount: computeTotalOrderAmount(),
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

    updateItemQuantity: (productId, newQuantity) => {
      const { cartItemsList } = get();

      const updatedCartItemsList = cartItemsList.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );

      set({
        cartItemsList: updatedCartItemsList,
        totalOrderAmount: computeTotalOrderAmount(),
      });
    },
  };
});
