import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import useQnaProductSearchStore from '@store/qnaProductSearchStore';
import useAxiosInstance from '@hooks/useAxiosInstance';
import { useSearchParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
export default function QnAProductModal({ onClose, onProductSelect }) {
  const axiosInstance = useAxiosInstance();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const searchRef = useRef('');
  const MySwal = withReactContent(Swal);

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

  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const params = {
    keyword: searchParams.get('keyword') || '',
    page: searchParams.get('page') || 1,
    limit: 5,
  };

  useEffect(() => {
    const currentKeyword = searchParams.get('keyword') || '';
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const currentLimit = parseInt(searchParams.get('limit')) || 5;

    setSearchKeyword(currentKeyword);
    setPageSize(currentLimit);

    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page: currentPage,
          limit: currentLimit,
        };

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

  // pagination 정보를 받아올 때 total pages 계산
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await axiosInstance.get('/products', { params });
        setProducts(response.data.item);
        setSearchCount(response.data.pagination.total);

        // 전체 페이지 수 계산
        setTotalPages(Math.ceil(response.data.pagination.total / pageSize));
      } catch (err) {
        setError(err.message);
      }
    };
    loadInitialData();
  }, [searchParams]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    const trimmedKeyWord = searchKeyword.trim();
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: 1,
        limit: pageSize,
        ...(trimmedKeyWord && { title: trimmedKeyWord }),
      };

      setSearchParams({
        ...(trimmedKeyWord && { keyword: trimmedKeyWord }),
        page: '1',
        limit: pageSize.toString(),
      });

      const response = await axiosInstance.get('/products', { params });
      setProducts(response.data.item);
      setSearchCount(response.data.pagination.total);
    } catch (err) {
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
    } finally {
      setLoading(false);
    }
  };

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

  const handlePageChange = async (page) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pageSize,
        ...(searchKeyword.trim() && { title: searchKeyword.trim() }),
      };

      // URL 파라미터 업데이트
      setSearchParams({
        ...(searchKeyword.trim() && { keyword: searchKeyword.trim() }),
        page: page.toString(),
        limit: pageSize.toString(),
      });

      const response = await axiosInstance.get('/products', { params });
      setProducts(response.data.item);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3; // 한 번에 보여줄 페이지 번호 수

    // 보여줄 페이지 번호 계산
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // startPage 재조정
    startPage = Math.max(1, endPage - maxVisiblePages + 1);

    // 페이지 번호 배열 생성
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className='justify-center mb-[16px] flex gap-[16px] mt-10'>
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
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
              currentPage === number
                ? 'bg-secondary-20 text-white'
                : 'bg-grey-20 text-black'
            } w-[40px] py-[8px] rounded-md text-[15px] text-center hover:bg-secondary-40`}
          >
            {number}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
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
      {/* 헤더 */}
      <div className='bg-primary-40 text-white p-3 flex justify-between items-center'>
        <h2 className='text-lg font-medium'>상품검색</h2>
        <button
          onClick={onClose}
          className='text-white hover:text-primary-5 px-3 transition-colors'
        >
          ✕
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className='p-6 flex-1 flex flex-col min-h-0'>
        {/* 검색 영역 */}
        <div className='bg-white rounded mb-4 border border-grey-20 p-4'>
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

        {/* 검색 결과 카운트 & 정렬 옵션 */}
        <div className='flex justify-between items-center mb-4'>
          <p className='text-lg text-grey-60'>
            총 <span className='font-medium'>{searchCount}</span>개의 상품이
            검색되었습니다
          </p>
          <select className='border border-grey-20 rounded p-1 text-lg focus:border-primary-30 focus:ring-1 focus:ring-primary-30 text-grey-60'>
            <option value='default'>기본순</option>
            <option value='price-asc'>낮은 가격순</option>
            <option value='price-desc'>높은 가격순</option>
            <option value='latest'>신상품순</option>
          </select>
        </div>

        {/* 검색 결과 테이블 */}
        <div className='flex-1 min-h-0'>
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
                        />
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td colSpan='3' className='text-center p-8'>
                        <div className='flex flex-col items-center gap-2'>
                          <span className='text-4xl'>🔍</span>
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

        {/* 하단 버튼 */}
        <div className='flex justify-center gap-4 mt-6'>
          <button
            onClick={handleSelect}
            className='px-6 py-2 bg-grey-10 text-grey-60 rounded hover:bg-grey-20 transition-colors'
          >
            선택
          </button>
        </div>
      </div>
    </div>
  );
}

QnAProductModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onProductSelect: PropTypes.func.isRequired,
};
