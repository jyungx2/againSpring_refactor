import { create } from 'zustand';

const useQnaProductSearchStore = create((set) => ({
  // 상태
  products: [],
  loading: false,
  error: null,
  searchCount: 0,
  selectedProduct: null,

  // 액션
  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchCount: (searchCount) => set({ searchCount }),
  setSelectedProduct: (selectedProduct) => set({ selectedProduct }),

  // 상태 초기화
  resetStore: () =>
    set({
      products: [],
      loading: false,
      error: null,
      searchCount: 0,
      selectedProduct: null,
    }),
}));

export default useQnaProductSearchStore;
