import PropTypes from 'prop-types';
import { useState } from 'react';

export default function QnAProductModal({ onClose }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchCount, setSearchCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 실제 API 연동 전 더미데이터 만들어서 테스트!
  const handleSearch = () => {
    if (searchKeyword.includes('칫솔')) {
      const productItems = [
        {
          _id: 1,
          name: '대나무 칫솔 (소형)',
          price: 1400,
        },
        {
          _id: 2,
          name: '목재 칫솔 (소형/대형)',
          price: 1690000,
        },
        {
          _id: 3,
          name: '대나무 칫솔 (일반형)',
          price: 2500,
        },
        {
          _id: 4,
          name: '대나무 칫솔 케이스',
          price: 1400,
        },
        {
          _id: 5,
          name: '코코넛 나무 칫솔',
          price: 5500,
        },
      ];
      setProducts(productItems);
      setSearchCount(productItems.length);
    } else {
      setProducts([]);
      setSearchCount(0);
    }
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
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
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
          onChange={(e) => setPageSize(Number(e.target.value))}
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
                <td className='p-3'>
                  <div className='w-32 h-32 bg-grey-10 rounded flex items-center justify-center'>
                    <span className='text-grey-40'>No Image</span>
                  </div>
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
        </tbody>
      </table>

      {/* 하단 버튼 - 회색 계열 사용 */}
      <div className='flex justify-center gap-4 mt-6'>
        <button
          onClick={onClose}
          className='px-6 py-2 bg-grey-10 text-grey-60 rounded hover:bg-grey-20 transition-colors'
        >
          닫기
        </button>
      </div>
    </div>
  );
}

QnAProductModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
