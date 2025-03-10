import useAxiosInstance from '../hooks/useAxiosInstance';

const useProductApi = () => {
  // 상품 등록 API 호출을 위한 커스텀 훅
  const axiosInstance = useAxiosInstance(); // axios 인스턴스 가져오기

  // 상품 등록 API
  const addProduct = async (productData) => {
    // 상품 데이터를 받아서 등록 요청
    try {
      // 요청 성공 시 응답 데이터 반환
      const response = await axiosInstance.post('/seller/products/', productData); // POST /seller/products 요청
      return response.data; // 응답 데이터 반환
    } catch (error) {
      // 요청 실패 시 에러 반환
      console.error('상품 등록 실패:', error.response?.data || error.message); // 에러 메시지 출력
      throw error; // 에러 반환
    }
  };

  return { addProduct }; // 상품 등록 API 반환
};

export default useProductApi;
