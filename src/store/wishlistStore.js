import { create } from "zustand";
import axios from "axios";
import useUserStore from "@store/userStore";

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

export const wishlistStore = create((set) => ({
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
      const instance = axiosInstance(user);
      const response = await instance.get("/bookmarks/product");

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

  // 위시리스트에 아이템 추가
  addToWishlist: async (product) => {
    const { user } = useUserStore.getState();
    const instance = axiosInstance(user);

    try {
      // product._id가 정수인지 확인
      const targetId = parseInt(product._id, 10);

      if (isNaN(targetId)) {
        throw new Error("Product ID is not a valid integer");
      }

      const requestBody = {
        target_id: targetId,
      };

      console.log("Request URL: /bookmarks/product");
      console.log("Request Body:", requestBody); // 요청 본문 확인

      const response = await instance.post("/bookmarks/product", requestBody);

      console.log("Response:", response); // 응답 확인

      if (response.status === 201) {
        await set((state) => ({
          wishlistItems: [
            ...state.wishlistItems,
            {
              id: product._id,
              name: product.name,
              price: product.price,
              image: product.mainImages[0]?.path
                ? `https://11.fesp.shop${product.mainImages[0].path}`
                : "/path/to/default/image.png",
              _id: product._id,
            },
          ],
        }));
        return true; // 추가 성공
      }
    } catch (error) {
      console.error("Error Response:", error.response?.data || error.message); // 에러 로그 출력
      if (error.response?.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);
      }
      set({ error: "위시리스트에 아이템 추가 실패." });
    }
    return false; // 추가 실패
  },

  // 위시리스트 삭제
  deleteItem: async (itemId) => {
    const { user } = useUserStore.getState();

    try {
      const instance = axiosInstance(user);
      await instance.delete(`/bookmarks/${itemId}`);

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
}));

export default wishlistStore;
///
