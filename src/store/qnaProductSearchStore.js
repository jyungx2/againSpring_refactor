import { create } from 'zustand';

const useQnaProductSearchStore = create((set) => ({
  products: [],
  loading: false,
  error: null,
  searchCount: 0,
  selectedProduct: null,

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchCount: (searchCount) => set({ searchCount }),
  setSelectedProduct: (selectedProduct) => set({ selectedProduct }),

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
