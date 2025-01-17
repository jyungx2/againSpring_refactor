import { create } from "zustand";
import axios from "axios";
import useUserStore from "@store/userStore";
import cartStore from "@store/cartStore";

const axiosInstance = (user) => {
  return axios.create({
    baseURL: "https://11.fesp.shop",
    timeout: 1000 * 15,
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "client-id": "final02",
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
  placeOrder: async (products) => {
    const { user } = useUserStore.getState();
    const deleteProductsFromCart = cartStore.getState().deleteProductsFromCart;

    if (!user || !user.accessToken) {
      set({ error: "로그인이 필요합니다." });
      return;
    }

    set({ loading: true, error: null, successMessage: null });

    try {
      const instance = axiosInstance(user);

      // 상품의 수량 확인
      for (const product of products) {
        console.log(product);
        const response = await instance.get(`/products/${product.id}`);
        const availableQuantity = response.data.quantity;

        if (availableQuantity < product.quantity) {
          set({ error: `수량이 부족합니다.` });
          setTimeout(() => {
            set({ error: null });
          }, 1500);
          return;
        }
      }

      const response = await instance.post("/orders/", { products });

      if (response.status === 201) {
        set({ successMessage: "주문이 완료되었습니다." });

        setTimeout(async () => {
          const productIdsToRemove = products.map((product) => product._id);

          await deleteProductsFromCart(productIdsToRemove);

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
