import { create } from "zustand";
import axios from "axios";
import useUserStore from "@store/userStore";

const axiosInstance = () => {
  const { user } = useUserStore.getState();

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

export const wishlistStore = create((set) => {
  const instance = axiosInstance();

  return {
    wishlistItems: [],
    loading: false,
    error: null,

    // 위시리스트 목록 조회
    fetchWishlistItems: async () => {
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
        const response = await instance.get("/bookmarks/product", {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        if (!response.data.item || response.data.item.length === 0) {
          set({
            wishlistItems: [],
            loading: false,
          });
          return;
        }

        const wishlist = response.data.item.map((item) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.mainImages[0]?.path
            ? `https://11.fesp.shop${item.product.mainImages[0].path}`
            : "/path/to/default/image.png",
          _id: item._id,
        }));

        set({
          wishlistItems: wishlist,
          loading: false,
        });
      } catch (error) {
        console.error(
          "Error fetching wishlist items",
          error.response?.data || error.message
        );
        set({
          loading: false,
          error: "위시리스트를 가져오는 데 실패했습니다.",
        });
      }
    },

    // 위시리스트 삭제
    deleteItem: async (itemId) => {
      const { user } = useUserStore.getState();

      try {
        await instance.delete(`/bookmarks/${itemId}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        set((state) => ({
          wishlistItems: state.wishlistItems.filter(
            (item) => item._id !== itemId
          ),
        }));
      } catch (error) {
        console.error(
          "Error deleting wishlist item",
          error.response?.data || error.message
        );
        set({
          error: "위시리스트 삭제에 실패했습니다.",
        });
      }
    },
  };
});

export default wishlistStore;
