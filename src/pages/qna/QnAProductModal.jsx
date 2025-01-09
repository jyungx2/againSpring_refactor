import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import useQnaProductSearchStore from '@store/qnaProductSearchStore';
import useAxiosInstance from '@hooks/useAxiosInstance';
import { useSearchParams } from 'react-router-dom';

/**
 *
 * TODO 상품 목록 불러오는 과정
 *
 * 1. API 호출 준비(완료)
 *  - useAxiosInstance import
 *  - useStore로 필요한 상태 추가 (loading, error 상태 등)
 *  - useEffect로 컴포넌트 마운트 시 초기 데이터 로드
 *
 * 2. 검색 파라미터 구성 (완료)
 *  - 현재 searchKeyword, pageSize 상태 활용
 *  - API 쿼리 파라미터 구성 (예: ?title=검색어&limit=페이지사이즈)
 *  - 정렬이나 추가 필터링 필요시 파라미터 추가
 *
 * 3. handleSearch 함수 수정(완료)
 * React Query와 기존 로직이 혼재되어 있음
 * 검색 로직 정리 필요
 *  - 기존 더미데이터 부분 제거 (완료)
 *  - axios instance를 사용해 API 호출
 *  - 로딩 상태 처리
 *  - try-catch로 에러 처리 (완료)
 *  - 성공 시 응답 데이터를 products 상태에 저장
 *  - pagination.total을 searchCount에 저장
 *
 * 4. 받아온 데이터 바인딩(완료)
 *  - products.map()에서 API 응답 구조에 맞게 속성 매핑
 *  - 이미지 경로 처리 (baseURL + mainImages[0].path) (완료)
 *  - 기본적인 상품 정보 표시 (완료)
 *
 * 5. 선택한 상품 처리(부분완료)
 *  - selectedProduct 상태를 부모 컴포넌트로 전달 (완료)
 *  - QnANewPostPage에서 선택된 상품 정보 표시 (미완료)
 *
 * 6. 페이지네이션 구현 (선택 사항)
 *  - 현재 페이지 상태 추가
 *  - API 응답의 pagination 정보 활용
 *  - 페이지 이동 UI 및 기능 구현
 *
 * 7. 에러 처리 및 UI/UX 개선 (완료)
 *  - 로딩 인디케이터 추가
 *  - 에러 메시지 표시
 *  - 검색 결과 없을 때의 UI 개선
 *  - 입력값 유효성 검사
 *
 */
export default function QnAProductModal({ onClose, onProductSelect }) {
  const axiosInstance = useAxiosInstance();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const searchRef = useRef('');

  // zustand store에서 상태와 액션 가져오기
  const {
    products,
    loading,
    error,
    searchCount,
    selectedProduct,

    setProducts,
    setLoading,
    setError,
    setSearchCount,
    setSelectedProduct,
  } = useQnaProductSearchStore();

  /**
   * TODO: Zustand로 검색 로직 정리하기
   *
   * 1. React Query 관련 코드 제거 (완료)
   *  - useQuery import 제거
   *  - useQuery 훅 제거
   *  - data, refetch 관련 코드 제거
   *
   * 2. URL 검색 파라미터 처리 (완료)
   *  - useSearchParams 활용
   *  - searchKeyword와 pageSize를 URL에 반영
   *  - URL 변경 시 검색 실행되도록 처리
   *
   * 3. handleSearch 함수 개선 (완료)
   *  - e.preventDefault() 추가
   *  - 검색어 없을 때 처리
   *  - axiosInstance.get 호출 시 파라미터 정리
   *  - 응답 데이터 처리 구조 확인
   *
   * 4. 페이지 사이즈 변경 처리 (완료)
   *  - pageSize 변경 시 자동 검색 실행
   *  - URL params 업데이트
   *
   * 5. 컴포넌트 마운트 시 초기 데이터 (완료)
   *  - useEffect 내 초기 검색 로직 점검
   *  - URL params 있을 경우 반영
   *
   * 6. 상품 선택 처리(부분 완료)
   *  - selectedProduct 상태 업데이트 확인 (완료)
   *  - 선택된 상품 정보 부모로 전달 방식 구현 (미완료)
   */

  // 쿼리 스트링 정보를 읽거나 설정
  // /products?keyword=레고&page=3 => new URLSearchParams('keyword=레고&page=3')
  const [searchParams, setSearchParams] = useSearchParams();

  const params = {
    keyword: searchParams.get('keyword') || '',
    page: searchParams.get('page') || 1,
    limit: 5,
  };

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    const currentKeyword = searchParams.get('keyword') || '';
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const currentLimit = parseInt(searchParams.get('limit')) || 5;

    setSearchKeyword(currentKeyword);
    setPageSize(currentLimit);

    // 초기 데이터 로드를 위한 별도 함수
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: currentPage,
          limit: currentLimit,
        };
        // URL에 키워드가 있으면 추가
        if (currentKeyword) {
          params.title = currentKeyword;
        }

        const response = await axiosInstance.get('/products', { params });
        setProducts(response.data.item);
        setSearchCount(response.data.pagination.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [searchParams]);

  /**
   * TODO: handleSearch 함수 개선
   *
   * 1. 검색어 없을 때 처리 (완료)
   *  - searchKeyword.trim()으로 공백 제거한 검색어 확인 (완료)
   *  - 검색어가 빈 문자열일 때의 처리 로직 추가
   *    - 전체 목록 보여주기
   *    - 선택한 처리 방식에 따른 로직 구현
   *  - 유효성 검사 로직 위치 결정 (handleSearch 시작 부분)
   *
   * 2. axiosInstance.get 호출 파라미터 정리 (완료)
   *  - API 파라미터 정의
   *    - title: 검색어 (필수)
   *    - page: 현재 페이지 (기본값: 1)
   *    - limit: 페이지 크기 (기본값: 5)
   *  - 빈 값 처리
   *    - undefined, null, 빈 문자열 처리
   *    - 기본값 설정
   *  - API 형식에 맞게 파라미터 구조화
   *
   * 3. 구현 후 체크포인트 (완료)
   *  - 검색어 없이 검색 시 처리가 제대로 되는가
   *  - API 파라미터가 올바르게 전달되는가
   *  - API 응답이 정상적으로 처리되는가
   *  - 에러 상황이 적절히 처리되는가
   */

  const handleSearch = async (e) => {
    // 검색
    if (e) e.preventDefault(); // 이벤트 객체가 있을 경우에만 preventDefault 호출

    const trimmedKeyWord = searchKeyword.trim();
    setLoading(true);
    setError(null);

    try {
      // 검색 파라미터 객체 직접 구성
      const params = {
        page: 1,
        limit: pageSize,
        ...(trimmedKeyWord && { title: trimmedKeyWord }), // 검색어가 있을 때만 title 파라미터 추가
      };

      // 검색 파라미터 구성
      setSearchParams({
        ...(trimmedKeyWord && { keyword: trimmedKeyWord }),
        page: '1', // 새로운 검색 시 첫 페이지로
        limit: pageSize.toString(),
      });

      // params를 직접 전달
      const response = await axiosInstance.get('/products', { params });

      setProducts(response.data.item);
      setSearchCount(response.data.pagination.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // pageSize 변경 핸들러
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setSearchParams({
      ...Object.fromEntries(searchParams),
      limit: newSize.toString(),
      page: '1', // 페이지 크기 변경 시 첫 페이지로
    });
    // 페이지 사이즈 변경 시 자동으로 검색 실행
    handleSearch();
  };

  // 선택 버튼 클릭 시 처리
  const handleSelect = () => {
    const seleted = products.find((p) => p._id === selectedProduct);
    onProductSelect(seleted);
    onClose();
  };

  return (
    <div className='p-6 bg-white rounded-lg relative'>
      {/* 헤더 - 더 부드러운 녹색으로 변경 */}
      <div className='bg-primary-40 text-white p-3 -mx-6 -mt-6 mb-6 flex justify-between items-center rounded-t-lg'>
        <h2 className='text-lg font-medium'>상품검색</h2>
        <button
          onClick={onClose}
          className='text-white hover:text-primary-5 px-3 transition-colors'
        >
          ✕
        </button>
      </div>

      {/* 검색 영역 - 연한 회색 테두리 사용 */}
      <div className='p-4 bg-white rounded mb-4 border border-grey-20'>
        <div className='flex gap-2 items-center'>
          <select className='border border-grey-20 rounded p-2 w-32 focus:border-primary-30 focus:ring-1 focus:ring-primary-30 text-grey-60'>
            <option>상품명</option>
          </select>
          <input
            type='text'
            defaultValue={params.keyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            ref={searchRef}
            className='border border-grey-20 rounded p-2 flex-1 focus:border-primary-30 focus:ring-1 focus:ring-primary-30 text-grey-60'
            placeholder='검색어를 입력하세요'
          />
          <button
            onClick={handleSearch}
            className='bg-primary-40 text-white px-4 py-2 rounded hover:bg-primary-50 transition-colors'
          >
            검색하기
          </button>
        </div>
      </div>

      {/* 검색 결과 카운트 & 페이지 사이즈 */}
      <div className='flex justify-between items-center mb-4'>
        <p className='text-lg text-grey-60'>
          총 <span className='font-medium'>{searchCount}</span>개의 상품이
          검색되었습니다
        </p>
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className='border border-grey-20 rounded p-1 text-lg focus:border-primary-30 focus:ring-1 focus:ring-primary-30 text-grey-60'
        >
          <option value={5}>5개씩 보기</option>
          <option value={10}>10개씩 보기</option>
          <option value={15}>15개씩 보기</option>
        </select>
      </div>

      {/* 검색 결과 테이블 */}
      <table className='w-full border-t border-grey-20'>
        <thead>
          <tr className='bg-primary-5'>
            <th className='p-3 text-left border-b border-grey-20 w-1/3 text-grey-60'>
              상품 이미지
            </th>
            <th className='p-3 text-left border-b border-grey-20 text-grey-60'>
              상품 정보
            </th>
            <th className='p-3 text-left border-b border-grey-20 w-24 text-grey-60'>
              선택
            </th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id} className='border-b border-grey-20'>
                {/* TODO 이미지 표시 로직 수정
                1. map 함수 내부에서는 현재 순회 중인 product 객체를 사용해야 함
                - products 배열이 아닌 현재 product의 mainImages 체크 필요 
                - 조건문의 주체를 products에서 product로 변경 (수정 완료)

                2. Optional Chaining(옵셔널 체이닝) 위치 확인
                - 배열 전체가 아닌 현재 상품의 속성을 체크해야 함
                - mainImages 배열의 존재 여부를 확인하는 위치 변경 */}
                <td className='p-3'>
                  {product.mainImages?.length > 0 ? (
                    <img
                      src={`https://11.fesp.shop${product.mainImages[0].path}`}
                      alt={product.name}
                      className='w-32 h-32 object-cover rounded'
                    />
                  ) : (
                    <div className='w-32 h-32 bg-grey-10 rounded flex items-center justify-center'>
                      <span className='text-grey-40'>No Image</span>
                    </div>
                  )}
                </td>
                <td className='p-3'>
                  <h3 className='font-medium mb-2'>{product.name}</h3>
                  <p className='text-primary-40'>
                    {product.price.toLocaleString()}원
                  </p>
                </td>
                <td className='p-3 text-center'>
                  <input
                    type='radio'
                    name='productSelection'
                    checked={selectedProduct === product._id}
                    onChange={() => setSelectedProduct(product._id)}
                    className='w-4 h-4 text-primary-40 border-grey-20 focus:ring-primary-30'
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='3' className='text-center p-4 text-grey-50'>
                검색 결과가 없습니다
              </td>
            </tr>
          )}
          {loading && (
            <tr>
              <td colSpan='3' className='text-center p-4'>
                <div>로딩중...</div>
              </td>
            </tr>
          )}

          {error && (
            <tr>
              <td colSpan='3' className='text-center p-4 text-error'>
                {error}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 하단 버튼 - 회색 계열 사용 */}
      <div className='flex justify-center gap-4 mt-6'>
        <button
          onClick={handleSelect}
          className='px-6 py-2 bg-grey-10 text-grey-60 rounded hover:bg-grey-20 transition-colors'
        >
          선택
        </button>
      </div>
    </div>
  );
}

QnAProductModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onProductSelect: PropTypes.func.isRequired,
};
