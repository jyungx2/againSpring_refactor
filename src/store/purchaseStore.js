import { create } from "zustand";
import axios from "axios";
import useUserStore from "@store/userStore";
import cartStore from "@store/cartStore";

const axiosInstance = (user) => {
  return axios.create({
    baseURL: "https://fesp-api.koyeb.app/market",
    timeout: 1000 * 15,
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "client-id": "febc11-final02-regj",
      Authorization: user?.accessToken
        ? `Bearer ${user.accessToken}`
        : undefined,
    },
  });
};

const purchaseStore = create((set) => ({
  loading: false,
  error: null,
  successMessage: null,

  // 주문하기
  placeOrder: async (cartItems) => {
    const { user } = useUserStore.getState();
    const deleteProductsFromCart = cartStore.getState().deleteProductsFromCart;

    if (!user || !user.accessToken) {
      set({ error: "로그인이 필요합니다." });
      return;
    }

    set({ loading: true, error: null, successMessage: null });

    try {
      const instance = axiosInstance(user);

      // 상품 구매 데이터 생성
      const orderProducts = cartItems.map((item) => ({
        _id: item.id,
        quantity: item.quantity,
      }));

      // 상품의 수량 확인
      for (const product of orderProducts) {
        const response = await instance.get(`/products/${product._id}`);
        const availableQuantity = response.data.quantity;

        if (availableQuantity < product.quantity) {
          set({ error: `수량이 부족합니다.` });
          setTimeout(() => {
            set({ error: null });
          }, 1500);
          return;
        }
      }

      const response = await instance.post("/orders/", {
        products: orderProducts,
      });

      if (response.status === 201) {
        set({ successMessage: "주문이 완료되었습니다." });

        setTimeout(async () => {
          const productIdsToRemove = cartItems.map((item) => item._id);

          if (typeof deleteProductsFromCart === "function") {
            await deleteProductsFromCart(productIdsToRemove);
          } else {
            console.error();
          }

          set({ successMessage: null });
        }, 1500);
      } else {
        set({ error: "주문에 실패했습니다." });
      }
    } catch (error) {
      set({ error: error.response?.data?.message || "주문에 실패했습니다." });
      setTimeout(() => {
        set({ error: null });
      }, 1500);
    } finally {
      set({ loading: false });
    }
  },
}));

export default purchaseStore;
