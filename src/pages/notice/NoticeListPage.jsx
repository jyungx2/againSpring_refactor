import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/fonts.css';
import useUserStore from '@store/userStore';
import useAxiosInstance from '@hooks/useAxiosInstance';
import { useQuery } from '@tanstack/react-query';
import NoticeListItem from './NoticeListItem';
import useBoard from '@hooks/useBoard';

/**
 * 사용자 정보 조회 함수
 * @param {AxiosInstance} axios - Axios 인스턴스
 * @returns {Promise<Object>} 사용자 정보 응답 데이터
 */
const fetchUserInfo = async (axios) => {
  const response = await axios.get('/users');
  return response.data;
};

export default function NoticeListPage() {
  const navigate = useNavigate();
  const axios = useAxiosInstance();
  const { user } = useUserStore();

  const {
    searchConditions,
    handleSearchTextChange,
    handleSortChange,
    handlePeriodChange,
    handleDateChange,
    handleSearch,
    data,
    isLoading,
    error,
    currentPage,
    totalPages,
    total,
    getPageLink,
    getPageRange,
    showPrevButton,
    showNextButton,
    prevGroupLastPage,
    nextGroupFirstPage,
    startPage,
    endPage,
    limit,
  } = useBoard({ type: 'notice', limit: 12 });

  const {
    text: searchText,
    sort: sortOption,
    period: { type: periodType, startDate, endDate },
  } = searchConditions;

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => fetchUserInfo(axios),
  });

  const userType = user
    ? userData?.item?.find((item) => item._id === user._id)?.type
    : null;
  const isAdmin = userType === 'admin';

  if (isUserLoading || isLoading) {
    return <div>로딩중...</div>;
  }

  if (!userData?.item || !data) {
    return <div>데이터를 불러오는데 실패했습니다.</div>;
  }

  /**
   * 검색 결과에 따른 공지사항 목록 렌더링
   * - 검색어가 있는 경우: 검색 결과 또는 "검색 결과 없음" 메시지 표시
   * - 검색어가 없는 경우: 전체 공지사항 목록 표시
   */
  const noticePostList = searchText.trim() ? (
    data.length > 0 ? (
      data.map((item, index) => (
        <NoticeListItem
          key={item._id}
          item={item}
          number={total - ((currentPage - 1) * limit + index)}
        />
      ))
    ) : (
      // 검색 결과가 없는 경우의 UI
      <div className='col-span-4 py-16'>
        <div className='flex flex-col items-center gap-2'>
          <span className='text-4xl' role='img' aria-label='검색'>
            🔍
          </span>
          <p className='text-grey-60'>검색 결과가 없습니다.</p>
          <p className='text-sm text-grey-40'>다른 검색어로 시도해보세요.</p>
          <button
            onClick={() => {
              handleSearch();
              navigate('?page=1');
            }}
            className='mt-2 px-4 py-2 bg-secondary-20 text-white rounded hover:bg-secondary-40 transition-colors'
          >
            전체 공지사항 보기
          </button>
        </div>
      </div>
    )
  ) : (
    // 전체 공지사항 목록 표시
    data.map((item, index) => (
      <NoticeListItem
        key={item._id}
        item={item}
        number={total - ((currentPage - 1) * limit + index)}
      />
    ))
  );

  return (
    <div className='w-[1200px] mx-auto px-6 mb-20'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        공지사항
      </h1>
      <div className='flex justify-between items-center mb-4'>
        <select
          value={sortOption}
          onChange={handleSortChange}
          className='border border-grey-20 rounded p-1 text-lg focus:border-secondary-30 focus:ring-1 focus:ring-secondary-30 text-grey-60'
          aria-label='정렬 기준'
        >
          <option value='default'>기본순</option>
          <option value='title-asc'>제목 오름차순</option>
          <option value='title-desc'>제목 내림차순</option>
          <option value='date-asc'>작성일 오름차순</option>
          <option value='date-desc'>작성일 내림차순</option>
          <option value='view-asc'>조회수 오름차순</option>
          <option value='view-desc'>조회수 내림차순</option>
        </select>

        {isAdmin && (
          <button
            onClick={() => navigate('/notice/new')}
            className='px-5 py-2 bg-secondary-20 text-white rounded hover:bg-secondary-40 transition-colors'
          >
            작성하기
          </button>
        )}
      </div>

      <div className='grid grid-cols-[repeat(4,280px)] justify-center gap-6 w-[calc(4_*_280px_+_3_*_24px)] mx-auto my-0'>
        {noticePostList}
      </div>

      <div className='justify-center mb-[16px] flex gap-[16px] mt-10'>
        {totalPages > 1 && (
          <div className='justify-center mb-[16px] flex gap-[16px] mt-10'>
            {showPrevButton && (
              <Link
                to={getPageLink(prevGroupLastPage)}
                className='bg-grey-20 text-black w-[60px] py-[8px] rounded-md text-[15px] text-center hover:bg-grey-30'
              >
                Prev
              </Link>
            )}

            {getPageRange().map((pageNum) => (
              <Link
                key={pageNum}
                to={getPageLink(pageNum)}
                className={`${
                  currentPage === pageNum
                    ? 'bg-secondary-20 text-white'
                    : 'bg-grey-20 text-black'
                } w-[40px] py-[8px] rounded-md text-[15px] text-center hover:bg-grey-30`}
              >
                {pageNum}
              </Link>
            ))}

            {showNextButton && (
              <Link
                to={getPageLink(nextGroupFirstPage)}
                className='bg-grey-20 text-black w-[60px] py-[8px] rounded-md text-[15px] text-center hover:bg-grey-30'
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>

      <div className='pt-10 flex justify-center gap-[5.4px] h-[70.67px]'>
        <div className='relative w-[120px]'>
          <select
            value={periodType}
            onChange={(e) => handlePeriodChange(e.target.value)}
            className='w-full h-[37px] px-2.5 border border-grey-10 rounded bg-white'
          >
            <option value='all-day'>전체기간</option>
            <option value='one-day'>1일</option>
            <option value='one-week'>1주</option>
            <option value='one-month'>1개월</option>
            <option value='six-month'>6개월</option>
            <option value='one-year'>1년</option>
            <option value='custom'>기간 입력</option>
          </select>
        </div>

        {periodType === 'custom' && (
          <div className='flex gap-2'>
            <input
              type='date'
              value={startDate}
              onChange={(e) => handleDateChange('start', e.target.value)}
              className='h-[37px] px-2 border border-gray-300 rounded'
            />
            <span className='flex items-center'>~</span>
            <input
              type='date'
              value={endDate}
              onChange={(e) => handleDateChange('end', e.target.value)}
              className='h-[37px] px-2 border border-gray-300 rounded'
            />
          </div>
        )}

        <input
          type='text'
          value={searchText}
          onChange={handleSearchTextChange}
          className='h-[37px] py-0 px-3 border border-grey-10 rounded w-[200px]'
          placeholder='검색어를 입력하세요'
        />
        <button
          type='submit'
          onClick={handleSearch}
          className='bg-secondary-20 hover:bg-secondary-40 transition-colors text-white h-[37px] py-0 px-[25px] border-none rounded cursor-pointer leading-[37px]'
        >
          찾기
        </button>
      </div>
    </div>
  );
}
