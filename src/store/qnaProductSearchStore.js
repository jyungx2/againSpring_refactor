import { create } from 'zustand';

/**
 * Q&A 게시글 작성/수정 시 상품 검색 관련 전역 상태 관리 스토어
 * @returns {Object} 상품 검색 관련 상태와 액션
 */
const useQnaProductSearchStore = create((set) => ({
  // 상태(State)
  products: [], // 검색된 상품 목록
  loading: false, // 로딩 상태
  error: null, // 에러 상태
  searchCount: 0, // 검색 수행 횟수
  selectedProduct: null, // 선택된 상품 정보

  /**
   * 검색된 상품 목록 업데이트 액션
   * @param {Array} products - 업데이트할 상품 목록
   */
  setProducts: (products) => set({ products }),

  /**
   * 로딩 상태 업데이트 액션
   * @param {boolean} loading - 설정할 로딩 상태
   */
  setLoading: (loading) => set({ loading }),

  /**
   * 에러 상태 업데이트 액션
   * @param {Error|null} error - 설정할 에러 객체
   */
  setError: (error) => set({ error }),

  /**
   * 검색 수행 횟수 업데이트 액션
   * @param {number} searchCount - 설정할 검색 횟수
   */
  setSearchCount: (searchCount) => set({ searchCount }),

  /**
   * 선택된 상품 정보 업데이트 액션
   * @param {Object|null} selectedProduct - 설정할 선택된 상품 정보
   */
  setSelectedProduct: (selectedProduct) => set({ selectedProduct }),

  /**
   * 스토어 상태 초기화 액션
   * 모든 상태를 초기값으로 리셋
   */
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
