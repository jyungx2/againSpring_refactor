import { create } from "zustand"; // Zustand 상태 관리 라이브러리 import
import axios from "axios"; // axios HTTP 클라이언트 라이브러리 import
import useUserStore from "@store/userStore"; // 사용자 정보를 관리하는 store import

// Axios 인스턴스를 생성하는 함수
const axiosInstance = (user) => {
  return axios.create({
    baseURL: "https://11.fesp.shop", // API 기본 URL
    timeout: 1000 * 15, // 요청 타임아웃 설정 (15초)
    headers: {
      "Content-Type": "application/json", // JSON 형식으로 요청
      accept: "application/json", // 응답 형식도 JSON으로 요청
      "client-id": "final02", // 클라이언트 아이디 설정
      Authorization: user?.accessToken // 액세스 토큰이 있으면 Authorization 헤더에 포함
        ? `Bearer ${user.accessToken}`
        : undefined,
    },
  });
};

// 장바구니 관련 상태 관리 store 정의
export const cartStore = create((set, get) => ({
  cartItemsList: [], // 장바구니 아이템 목록
  shippingCost: 0, // 배송비
  totalOrderAmount: 0, // 총 주문 금액
  loading: false, // 로딩 상태
  error: null, // 에러 메시지
  selectedItems: [], // 선택된 아이템 목록

  // 장바구니 목록을 가져오는 함수
  fetchCartItems: async () => {
    set({ loading: true, error: null }); // 로딩 시작, 에러 초기화

    const { user } = useUserStore.getState(); // 사용자 정보 가져오기

    if (!user || !user.accessToken) {
      console.error("Access Token이 존재하지 않습니다.");
      set({
        loading: false,
        error: "로그인이 필요합니다.", // 로그인 필요 메시지
      });
      return;
    }

    try {
      const instance = axiosInstance(user); // 사용자 토큰으로 axios 인스턴스 생성
      const response = await instance.get("/carts/"); // 장바구니 아이템 가져오기

      const products = response.data.item.map((item) => ({
        id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image.path,
        _id: item._id,
        user_id: item.user_id || user._id,
      }));

      set({
        cartItemsList: products, // 장바구니 아이템 리스트 갱신
        shippingCost: response.data.cost.shippingFees, // 배송비 갱신
        totalOrderAmount: get().computeTotalOrderAmount(), // 총 주문 금액 갱신
        loading: false, // 로딩 끝
      });
    } catch (error) {
      console.error(error.response?.data || error.message); // 에러 로그 출력
      set({
        loading: false,
        error: "장바구니 아이템을 가져오는 데 실패했습니다.", // 에러 메시지
      });
    }
  },

  // 장바구니에 아이템 추가
  addToCart: async (product) => {
    const { user } = useUserStore.getState(); // 사용자 정보 가져오기
    const instance = axiosInstance(user); // 사용자 토큰으로 axios 인스턴스 생성

    try {
      const requestBody = {
        product_id: product._id, // 상품 ID
        quantity: product.quantity, // 수량
      };

      console.log("Request Body:", requestBody); // 요청 데이터 로그 출력

      const response = await instance.post("/carts/", requestBody); // 장바구니에 상품 추가 요청

      if (response.status === 201) {
        await get().fetchCartItems(); // 장바구니 목록 새로 고침
        set({ totalOrderAmount: get().computeTotalOrderAmount() }); // 총 금액 갱신
        return true; // 추가 성공
      }
    } catch (error) {
      console.error("Error Response:", error.response?.data || error.message); // 에러 로그 출력
      set({ error: "장바구니에 아이템 추가 실패." }); // 에러 메시지
    }
    return false; // 추가 실패
  },

  // 수량 변경
  updateItemQuantity: async (productId, newQuantity) => {
    const { cartItemsList } = get();
    const cartItem = cartItemsList.find((item) => item.id === productId); // 상품 ID로 장바구니 아이템 찾기

    if (cartItem) {
      const { user } = useUserStore.getState();
      const instance = axiosInstance(user);

      try {
        const response = await instance.patch(`/carts/${cartItem._id}`, {
          quantity: newQuantity,
        });

        if (response.status === 200) {
          const updatedCartItemsList = cartItemsList.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          );

          set({
            cartItemsList: updatedCartItemsList, // 장바구니 아이템 리스트 갱신
            totalOrderAmount: get().computeTotalOrderAmount(), // 총 금액 갱신
          });
        } else {
          set({ error: "장바구니 상품 수량 변경 실패." }); // 에러 메시지
        }
      } catch (error) {
        console.error(error.response?.data || error.message); // 에러 로그 출력
        set({
          error: "장바구니 상품 수량 변경 실패.", // 에러 메시지
        });
      }
    } else {
      console.error("해당 상품 ID에 대한 장바구니 상품이 없음", productId); // 해당 상품이 장바구니에 없음
    }
  },

  // 총 주문 금액 계산 함수
  computeTotalOrderAmount: () => {
    const { cartItemsList, shippingCost } = get();
    const totalAmount = cartItemsList.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return totalAmount + shippingCost; // 상품 총액 + 배송비
  },
}));

export default cartStore;
