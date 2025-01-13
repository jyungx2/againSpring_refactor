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

      if (!user || !user.accessToken) {
        console.error("Access Token이 존재하지 않습니다.");
        set({
          loading: false,
          error: "로그인이 필요합니다.",
        });
        return;
      }

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
          image: item.product.image.path,
          _id: item._id,
        }));

        set({
          cartItemsList: products,
          shippingCost: response.data.cost.shippingFees,
          totalOrderAmount: computeTotalOrderAmount(),
          loading: false,
        });
      } catch (error) {
        console.error(
          "Error fetching cart items",
          error.response?.data || error.message
        );
        set({
          loading: false,
          error: "장바구니 아이템을 가져오는 데 실패했습니다.",
        });
      }
    },

    updateItemQuantity: async (productId, newQuantity) => {
      const { cartItemsList } = get();
      const cartItem = cartItemsList.find((item) => item.id === productId);

      if (cartItem) {
        const { user } = useUserStore.getState();

        try {
          const response = await axiosInstance.patch(
            `/carts/${cartItem._id}`,
            { quantity: newQuantity },
            {
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
              },
            }
          );

          if (response.status === 200) {
            const updatedCartItemsList = cartItemsList.map((item) =>
              item.id === productId ? { ...item, quantity: newQuantity } : item
            );

            set({
              cartItemsList: updatedCartItemsList,
              totalOrderAmount: computeTotalOrderAmount(),
            });
          } else {
            set({ error: "장바구니 상품 수량 변경 실패." });
          }
        } catch (error) {
          console.error(
            "Error updating item quantity:",
            error.response?.data || error.message
          );
          set({
            error: "장바구니 상품 수량 변경 실패.",
          });
        }
      } else {
        console.error("해당 상품 ID에 대한 장바구니 상품이 없음", productId);
      }
    },
  };
});
