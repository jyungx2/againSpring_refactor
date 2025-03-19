// 중복 코드 확인 예정
import { create } from 'zustand';
import axios from 'axios';
import useUserStore from '@store/userStore';

const axiosInstance = (user) => {
  return axios.create({
    baseURL: 'https://11.fesp.shop',
    timeout: 1000 * 15,
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'client-id': 'final02',
      Authorization: user?.accessToken ? `Bearer ${user.accessToken}` : undefined,
    },
  });
};

export const cartStore = create((set, get) => ({
  cartItemsList: [],
  shippingCost: 0,
  totalOrderAmount: 0,
  loading: false,
  error: null,
  selectedItems: [],

  // 총 주문 금액 계산
  computeTotalOrderAmount: () => {
    const { cartItemsList, shippingCost } = get();
    const totalPrice = cartItemsList.reduce((total, item) => total + item.price * item.quantity, 0);
    return totalPrice + shippingCost;
  },

  // 장바구니 목록 표시
  fetchCartItems: async () => {
    set({ loading: true, error: null });
    const { user } = useUserStore.getState();

    if (!user || !user.accessToken) {
      console.error('Access Token이 존재하지 않습니다.');
      set({ loading: false, error: '로그인이 필요합니다.' });
      return;
    }

    try {
      const instance = axiosInstance(user);
      const response = await instance.get('/carts/');
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
        cartItemsList: products,
        shippingCost: response.data.cost.shippingFees,
        totalOrderAmount: get().computeTotalOrderAmount(),
        loading: false,
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      set({ loading: false, error: '장바구니 아이템을 가져오는 데 실패했습니다.' });
    }
  },

  // 장바구니에 아이템 추가
  addToCart: async (product, quantity) => {
    const { user } = useUserStore.getState();
    const instance = axiosInstance(user);

    try {
      // product._id와 quantity를 정수로 변환
      const productId = parseInt(product._id, 10);
      const productQuantity = parseInt(quantity, 10);

      // 변환된 값이 유효한지 확인
      if (isNaN(productId) || isNaN(productQuantity)) {
        throw new Error('Product ID and quantity must be valid integers');
      }

      const requestBody = {
        product_id: productId, // 상품 ID
        quantity: parseInt(quantity, 10), // 수량
      };
      console.log('Request Body:', requestBody); // 요청 본문 확인
      const response = await instance.post('/carts/', requestBody);
      console.log('Response:', response); // 응답 확인

      if (response.status === 201) {
        await get().fetchCartItems();
        set({ totalOrderAmount: get().computeTotalOrderAmount() });
        return true; // 추가 성공
      }
    } catch (error) {
      console.error('Error Response:', error.response?.data || error.message); // 에러 로그 출력
      set({ error: '장바구니에 아이템 추가 실패.' });
    }
    return false; // 추가 실패
  },

  // 수량 변경
  updateItemQuantity: async (productId, newQuantity) => {
    const { cartItemsList } = get();
    const cartItem = cartItemsList.find((item) => item.id === productId);

    if (cartItem) {
      const { user } = useUserStore.getState();
      const instance = axiosInstance(user);

      try {
        const response = await instance.patch(`/carts/${cartItem._id}`, {
          quantity: parseInt(newQuantity, 10), // 수량을 정수로 변환
        });

        if (response.status === 200) {
          const updatedCartItemsList = cartItemsList.map((item) => (item.id === productId ? { ...item, quantity: parseInt(newQuantity, 10) } : item));

          set({
            cartItemsList: updatedCartItemsList,
            totalOrderAmount: get().computeTotalOrderAmount(),
          });
        } else {
          set({ error: '장바구니 상품 수량 변경 실패.' });
        }
      } catch (error) {
        console.error(error.response?.data || error.message);
        set({ error: '장바구니 상품 수량 변경 실패.' });
      }
    } else {
      console.error('해당 상품 ID에 대한 장바구니 상품이 없음', productId);
    }
  },
  // 체크박스 선택한 상품 추가
  selectItem: (id) => {
    set((state) => ({
      selectedItems: [...state.selectedItems, id],
    }));
  },

  // 체크박스 선택 해제
  deselectItem: (id) => {
    set((state) => ({
      selectedItems: state.selectedItems.filter((itemId) => itemId !== id),
    }));
  },

  // 선택한 상품 삭제
  deleteSelectedItems: async () => {
    const { selectedItems, cartItemsList } = get();
    const { user } = useUserStore.getState();

    if (selectedItems.length === 0) {
      set({ error: '선택한 상품이 없습니다.' });
      return;
    }

    const selectedCartItemIds = cartItemsList.filter((item) => selectedItems.includes(item.id)).map((item) => item._id);

    try {
      const instance = axiosInstance(user);
      await instance.delete(`/carts/`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
        data: { carts: selectedCartItemIds },
      });

      set((state) => ({
        cartItemsList: state.cartItemsList.filter((item) => !selectedItems.includes(item.id)),
        selectedItems: [],
        error: null,
      }));

      alert('선택한 상품이 삭제되었습니다.');
    } catch {
      set({ error: '상품 삭제에 실패했습니다.' });
    }
  },

  // 장바구니 비우기
  clearCart: async () => {
    const { user } = useUserStore.getState();

    try {
      const instance = axiosInstance(user);
      await instance.delete('/carts/cleanup', {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      set({
        cartItemsList: [],
        selectedItems: [],
        error: null,
      });
    } catch {
      set({ error: '장바구니 비우기에 실패했습니다.' });
    }
  },

  // 장바구니에서 구매한 상품만 제거
  deleteProductsFromCart: async (productIds) => {
    const { user } = useUserStore.getState();

    try {
      const instance = axiosInstance(user);

      await instance.delete('/carts/', {
        data: { carts: productIds },
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      set((state) => ({
        cartItemsList: state.cartItemsList.filter((item) => !productIds.includes(item._id)),
      }));
    } catch (error) {
      console.error(error);
      set({ error: '장바구니 상품 삭제에 실패했습니다.' });
    }
  },
}));

export default cartStore;
