import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import useQnaProductSearchStore from '@store/qnaProductSearchStore';
import useAxiosInstance from '@hooks/useAxiosInstance';
import { useSearchParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
export default function QnAProductModal({ onClose, onProductSelect }) {
  // API 인스턴스
  const axiosInstance = useAxiosInstance();
  const MySwal = withReactContent(Swal);

  // 검색 관련 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  // 페이지네이션 상태
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    pageSize: 5,
  });

  // Zustand 스토어에서 상태 가져오기
  const {
    products,
    loading,
    // error,
    searchCount,
    selectedProduct,
    setProducts,
    setLoading,
    setError,
    setSearchCount,
    setSelectedProduct,
  } = useQnaProductSearchStore();

  // 에러 처리 유틸리티
  const handleApiError = (err) => {
    const errorMessage =
      err.response?.status === 404
        ? '상품을 찾을 수 없습니다'
        : '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

    setError(errorMessage);
    MySwal.fire({
      title: '오류',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: '확인',
    });
  };

  // 상품 데이터 로딩
  const loadProductData = async (params) => {
    setLoading(true);
    try {
      // apiParams 변환 과정 제거하고 params 직접 전달
      const response = await axiosInstance.get('/products', { params });

      setProducts(response.data.item);
      setSearchCount(response.data.pagination.total);
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(
          response.data.pagination.total / pagination.pageSize
        ),
      }));
      return response;
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    const currentKeyword = searchParams.get('keyword') || '';
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const currentLimit =
      parseInt(searchParams.get('limit')) || pagination.pageSize;

    setSearchKeyword(currentKeyword);
    setPagination((prev) => ({
      ...prev,
      currentPage,
      pageSize: currentLimit,
    }));

    const params = {
      page: currentPage,
      limit: currentLimit,
      ...(currentKeyword && { keyword: currentKeyword }), // title -> keyword
    };

    loadProductData(params);
  }, [searchParams]);

  // 검색 핸들러
  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    if (searchKeyword.trim().length === 0) {
      MySwal.fire({
        title: '알림',
        text: '검색어를 입력하세요',
        icon: 'info',
        confirmButtonText: '확인',
      });
      return;
    }

    const trimmedKeyWord = searchKeyword.trim();
    const requestParams = {
      page: 1,
      limit: pagination.pageSize,
      ...(trimmedKeyWord && { keyword: trimmedKeyWord }),
    };

    try {
      const response = await loadProductData(requestParams);

      if (response) {
        setSearchParams({
          ...(trimmedKeyWord && { keyword: trimmedKeyWord }),
          page: '1',
          limit: pagination.pageSize.toString(),
        });
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // 상품 선택 핸들러
  const handleSelect = () => {
    try {
      const selected = products.find((p) => p._id === selectedProduct);
      if (!selected) {
        throw new Error('선택된 상품을 찾을 수 없습니다.');
      }

      MySwal.fire({
        title: '상품 선택 완료',
        text: `${selected.name} 상품이 선택되었습니다.`,
        icon: 'success',
        confirmButtonText: '확인',
      }).then((result) => {
        if (result.isConfirmed) {
          onProductSelect(selected);
          onClose();
        }
      });
    } catch (err) {
      MySwal.fire({
        title: '오류',
        text: err.message,
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = async (page) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.pageSize,
        ...(searchKeyword.trim() && { keyword: searchKeyword.trim() }), // title -> keyword
      };

      setSearchParams({
        ...(searchKeyword.trim() && { keyword: searchKeyword.trim() }),
        page: page.toString(),
        limit: pagination.pageSize.toString(),
      });

      await loadProductData(params);
      setPagination((prev) => ({ ...prev, currentPage: page }));
    } catch (err) {
      handleApiError(err);
    }
  };

  // 페이지네이션 컴포넌트
  const Pagination = () => {
    const calculatePageRange = (currentPage, totalPages, maxVisiblePages) => {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      return {
        startPage: Math.max(1, endPage - maxVisiblePages + 1),
        endPage,
      };
    };

    const { startPage, endPage } = calculatePageRange(
      pagination.currentPage,
      pagination.totalPages,
      3
    );

    const pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    return (
      <div className='justify-center mb-[16px] flex gap-[16px] mt-10'>
        {pagination.currentPage > 1 && (
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            className='bg-grey-20 text-black w-[60px] py-[8px] rounded-md text-[15px] text-center hover:bg-grey-30'
          >
            Prev
          </button>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`${
              pagination.currentPage === number
                ? 'bg-secondary-20 text-white'
                : 'bg-grey-20 text-black'
            } w-[40px] py-[8px] rounded-md text-[15px] text-center hover:bg-secondary-40`}
          >
            {number}
          </button>
        ))}

        {pagination.currentPage < pagination.totalPages && (
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            className='bg-grey-20 text-black w-[60px] py-[8px] rounded-md text-[15px] text-center hover:bg-grey-30'
          >
            Next
          </button>
        )}
      </div>
    );
  };

  return (
    <div className='max-h-[calc(100vh-4rem)] flex flex-col'>
      {/* 헤더 영역 */}
      <header className='bg-primary-40 text-white p-3 flex justify-between items-center'>
        <h2 className='text-lg font-medium'>상품검색</h2>
        <button
          onClick={onClose}
          className='text-white hover:text-primary-5 px-3 transition-colors'
          aria-label='닫기'
        >
          ✕
        </button>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className='p-6 flex-1 flex flex-col min-h-0'>
        {/* 검색 폼 */}
        <form
          onSubmit={handleSearch}
          className='bg-white rounded mb-4 border border-grey-20 p-4'
        >
          <div className='flex gap-2 items-center'>
            <select
              className='border border-grey-20 rounded p-2 w-32 focus:border-primary-30 focus:ring-1 focus:ring-primary-30 text-grey-60'
              aria-label='검색 조건'
            >
              <option>상품명</option>
            </select>
            <input
              type='text'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className='border border-grey-20 rounded p-2 flex-1 focus:border-primary-30 focus:ring-1 focus:ring-primary-30 text-grey-60'
              placeholder='검색어를 입력하세요'
              aria-label='검색어 입력'
            />
            <button
              type='submit'
              className='bg-primary-40 text-white px-4 py-2 rounded hover:bg-primary-50 transition-colors'
            >
              검색하기
            </button>
          </div>
        </form>

        {/* 검색 결과 요약 & 정렬 옵션 */}
        <div className='flex justify-between items-center mb-4'>
          <p className='text-lg text-grey-60'>
            총 <span className='font-medium'>{searchCount}</span>개의 상품이
            검색되었습니다
          </p>
          <select
            className='border border-grey-20 rounded p-1 text-lg focus:border-primary-30 focus:ring-1 focus:ring-primary-30 text-grey-60'
            aria-label='정렬 기준'
          >
            <option value='default'>기본순</option>
            <option value='price-asc'>낮은 가격순</option>
            <option value='price-desc'>높은 가격순</option>
            <option value='latest'>신상품순</option>
          </select>
        </div>

        {/* 검색 결과 테이블 */}
        <div className='flex-1 min-h-0 overflow-auto'>
          <table className='w-full border-t border-grey-20'>
            <thead>
              <tr className='bg-primary-5 text-base'>
                <th className='p-2 text-left border-b border-grey-20 w-24 text-grey-60'>
                  상품 이미지
                </th>
                <th className='p-2 text-left border-b border-grey-20 text-grey-60'>
                  상품 정보
                </th>
                <th className='p-2 text-left border-b border-grey-20 w-16 text-grey-60'>
                  선택
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-grey-20'>
              {products.length > 0
                ? products.map((product) => (
                    <tr key={product._id}>
                      <td className='py-1 pl-2'>
                        {product.mainImages?.length > 0 ? (
                          <img
                            src={`https://11.fesp.shop${product.mainImages[0].path}`}
                            alt={product.name}
                            className='w-24 h-24 object-cover rounded'
                            loading='lazy'
                          />
                        ) : (
                          <div className='w-24 h-24 bg-grey-10 rounded flex items-center justify-center'>
                            <span className='text-grey-40'>No Image</span>
                          </div>
                        )}
                      </td>
                      <td className='py-1 pl-1'>
                        <h3 className='font-medium mb-1'>{product.name}</h3>
                        <p className='text-primary-40'>
                          {product.price.toLocaleString()}원
                        </p>
                      </td>
                      <td className='py-1 pl-2 text-center'>
                        <input
                          type='radio'
                          name='productSelection'
                          checked={selectedProduct === product._id}
                          onChange={() => setSelectedProduct(product._id)}
                          className='w-4 h-4 text-primary-40 border-grey-20 focus:ring-primary-30'
                          aria-label={`${product.name} 선택`}
                        />
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td colSpan='3' className='text-center p-8'>
                        <div className='flex flex-col items-center gap-2'>
                          <span
                            className='text-4xl'
                            role='img'
                            aria-label='검색'
                          >
                            🔍
                          </span>
                          <p className='text-grey-60'>검색 결과가 없습니다.</p>
                          <p className='text-sm text-grey-40'>
                            다른 검색어로 시도해보세요.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {!loading && products.length > 0 && (
          <div className='mt-6'>
            <Pagination />
          </div>
        )}

        {/* 하단 버튼 영역 */}
        <div className='flex justify-center gap-4 mt-6'>
          <button
            onClick={handleSelect}
            className='px-6 py-2 bg-grey-10 text-grey-60 rounded hover:bg-grey-20 transition-colors'
            disabled={!selectedProduct}
          >
            선택
          </button>
        </div>
      </main>
    </div>
  );
}

QnAProductModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onProductSelect: PropTypes.func.isRequired,
};
