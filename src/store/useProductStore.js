// useProductStore.js
import { create } from 'zustand';

export const useProductStore = create((set) => ({
  // 단일 상품 정보 상태 (기본 폼)
  product: {
    name: '',
    price: '',
    quantity: '',
    shippingFees: '',
    mainImages: [],
    content: '',
    extra: {
      isNew: false,
      isBest: false,
      category: ['all-of-list'],
      tanso: '',
    },
  },
  // 추가된 상품 목록
  productList: [],
  // 편집 모드 인덱스 (null이면 새 상품 추가 모드)
  editingIndex: null,

  // 상태 업데이트 함수들
  setProduct: (newProduct) => set({ product: newProduct }),
  updateProduct: (updates) => set((state) => ({ product: { ...state.product, ...updates } })),
  addProductToList: (newProduct) => set((state) => ({ productList: [...state.productList, newProduct] })),
  updateProductList: (newList) => set({ productList: newList }),
  setEditingIndex: (index) => set({ editingIndex: index }),
  resetProduct: () =>
    set({
      product: {
        name: '',
        price: '',
        quantity: '',
        shippingFees: '',
        mainImages: [],
        content: '',
        extra: {
          isNew: false,
          isBest: false,
          category: ['all-of-list'],
          tanso: '',
        },
      },
    }),
  resetProductList: () => set({ productList: [] }),
}));
