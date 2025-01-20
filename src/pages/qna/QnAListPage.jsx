import useUserStore from '@store/userStore';
import '../../assets/styles/fonts.css';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosInstance from '@hooks/useAxiosInstance';
import QnAListItem from './QnAListItem';
import { useEffect, useState } from 'react';

const fetchUserInfo = async (axios) => {
  const response = await axios.get('/users');
  return response.data;
};

export default function QnAListPage() {
  const PAGES_PER_GROUP = 5;
  const limit = 12;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const axios = useAxiosInstance();
  const { user } = useUserStore();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [periodType, setPeriodType] = useState('all-day');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState(() => {
    const sortParam = searchParams.get('sort');
    if (!sortParam) return 'default';
    const options = {
      '{"title":1}': 'title-asc',
      '{"title":-1}': 'title-desc',
      '{"createdAt":1}': 'date-asc',
      '{"createdAt":-1}': 'date-desc',
      '{"views":1}': 'view-asc',
      '{"views":-1}': 'view-desc',
    };
    return options[sortParam] || 'default';
  });

  const calculateDateRange = (periodType) => {
    const currentDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    switch (periodType) {
      case 'one-day':
        return {
          start: formatDate(new Date(currentDate.getTime() - oneDay)),
          end: formatDate(currentDate),
        };
      case 'one-week':
        return {
          start: formatDate(new Date(currentDate.getTime() - oneDay * 7)),
          end: formatDate(currentDate),
        };
      case 'one-month': {
        const lastMonth = new Date(currentDate);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return {
          start: formatDate(lastMonth),
          end: formatDate(currentDate),
        };
      }
      case 'six-month': {
        const sixMonthsAgo = new Date(currentDate);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return {
          start: formatDate(sixMonthsAgo),
          end: formatDate(currentDate),
        };
      }
      case 'one-year': {
        const oneYearAgo = new Date(currentDate);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return {
          start: formatDate(oneYearAgo),
          end: formatDate(currentDate),
        };
      }
      default:
        return {
          start: '',
          end: '',
        };
    }
  };

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => fetchUserInfo(axios),
  });

  const { data: qnaData, isLoading: isQnaLoading } = useQuery({
    queryKey: ['posts', 'qna', currentPage, sortOption],
    queryFn: () =>
      axios.get('/posts', {
        params: {
          type: 'qna',
          page: currentPage,
          limit,
          ...(sortOption !== 'default' && {
            sort: getSortParamsByOption(sortOption),
          }),
        },
      }),
    select: (res) => res.data,
    staleTime: 1000 * 10,
  });

  useEffect(() => {
    if (qnaData?.item) {
      setFilteredData(qnaData.item);
    }
  }, [qnaData?.item]);

  const formatDateForSearch = (dateString, isEndDate = false) => {
    const formattedDate = dateString.replace(/-/g, '.');
    return isEndDate
      ? `${formattedDate} 23:59:59`
      : `${formattedDate} 00:00:00`;
  };

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);

    const newSearchParams = new URLSearchParams(searchParams);
    if (newSortOption !== 'default') {
      newSearchParams.set('sort', getSortParamsByOption(newSortOption));
    } else {
      newSearchParams.delete('sort');
    }
    navigate(`?${newSearchParams.toString()}`);
  };

  const handlePeriodChange = (newPeriodType) => {
    setPeriodType(newPeriodType);

    if (newPeriodType === 'custom') {
      setStartDate(startDate);
      setEndDate(endDate);
    } else if (newPeriodType === 'all-day') {
      setStartDate('');
      setEndDate('');
    } else {
      const { start, end } = calculateDateRange(newPeriodType);
      setStartDate(start);
      setEndDate(end);
    }
  };

  const handleDateChange = (type, value) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    console.log('=== 검색 시작 ===');
    const newSearchParams = new URLSearchParams();

    let defaultSearchParams = {
      type: 'qna',
      page: 1,
      limit,
    };

    console.log('검색어:', searchText.trim() ? searchText : '없음');

    if (searchText.trim()) {
      newSearchParams.set('keyword', searchText);
      defaultSearchParams.keyword = searchText;
    }

    console.log('기간 타입:', periodType);
    console.log('시작일:', startDate || '없음');
    console.log('종료일:', endDate || '없음');

    if (periodType !== 'all-day') {
      if (periodType === 'custom' && startDate && endDate) {
        defaultSearchParams.custom = JSON.stringify({
          createdAt: {
            $gte: formatDateForSearch(startDate),
            $lt: formatDateForSearch(endDate, true),
          },
        });
        newSearchParams.set('startDate', startDate);
        newSearchParams.set('endDate', endDate);
      } else if (periodType !== 'custom') {
        const { start, end } = calculateDateRange(periodType);
        defaultSearchParams.custom = JSON.stringify({
          createdAt: {
            $gte: formatDateForSearch(start),
            $lt: formatDateForSearch(end, true),
          },
        });
        newSearchParams.set('startDate', start);
        newSearchParams.set('endDate', end);
      }
    }

    if (sortOption !== 'default') {
      const sortParam = getSortParamsByOption(sortOption);
      newSearchParams.set('sort', sortParam);
      defaultSearchParams.sort = sortParam;
      console.log('정렬 옵션:', sortOption);
    }

    newSearchParams.set('page', '1');
    console.log('최종 URL 파라미터:', newSearchParams.toString());
    console.log('최종 API 파라미터:', defaultSearchParams);

    navigate(`?${newSearchParams.toString()}`);

    axios
      .get('/posts', {
        params: defaultSearchParams,
      })
      .then((response) => {
        console.log('검색 결과:', response.data);
        setFilteredData(response.data.item || []);
      })
      .catch((error) => {
        console.error('검색 중 오류 발생', error);
        setFilteredData([]);
      })
      .finally(() => {
        console.log('=== 검색 종료 ===');
      });
  };

  const getSortParamsByOption = (sortOption) => {
    const sortParams = {
      default: undefined,
      'title-asc': JSON.stringify({ title: 1 }),
      'title-desc': JSON.stringify({ title: -1 }),
      'date-asc': JSON.stringify({ createdAt: 1 }),
      'date-desc': JSON.stringify({ createdAt: -1 }),
      'view-asc': JSON.stringify({ views: 1 }),
      'view-desc': JSON.stringify({ views: -1 }),
    };

    return sortParams[sortOption];
  };

  const getPageLink = (pageNum) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNum.toString());

    if (searchText.trim()) {
      params.set('keyword', searchText);
    }

    if (periodType !== 'all-day') {
      params.set('periodType', periodType);
      if (periodType === 'custom') {
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);
      }
    }

    if (sortOption !== 'default') {
      params.set('sort', getSortParamsByOption(sortOption));
    }
    return `?${params.toString()}`;
  };

  const userType = user
    ? userData?.item?.find((item) => item._id === user._id)?.type
    : null;
  const isAdminOrUser = userType === 'admin' || userType === 'user';

  const totalData = qnaData?.pagination?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalData / limit));
  const currentGroup = Math.ceil(currentPage / PAGES_PER_GROUP);
  const startPage = (currentGroup - 1) * PAGES_PER_GROUP + 1;
  const endPage = Math.min(currentGroup * PAGES_PER_GROUP, totalPages);
  const prevGroupLastPage = startPage - 1;
  const nextGroupFirstPage = endPage + 1;
  const showPrevButton = currentGroup > 1;
  const showNextButton = endPage < totalPages;

  if (isUserLoading || isQnaLoading) {
    return <div>로딩중...</div>;
  }

  if (!userData?.item || !qnaData?.item) {
    return <div>데이터를 불러오는데 실패했습니다.</div>;
  }

  const qnaPostList = searchText.trim() ? (
    filteredData.length > 0 ? (
      filteredData.map((item, index) => (
        <QnAListItem
          key={item._id}
          item={item}
          number={totalData - ((currentPage - 1) * limit + index)}
        />
      ))
    ) : (
      <tr>
        <td colSpan='4' className='text-center py-16'>
          <div className='flex flex-col items-center gap-2'>
            <span className='text-4xl' role='img' aria-label='검색'>
              🔍
            </span>
            <p className='text-grey-60'>검색 결과가 없습니다.</p>
            <p className='text-sm text-grey-40'>다른 검색어로 시도해보세요.</p>
            <button
              onClick={() => {
                setSearchText('');
                setFilteredData(qnaData.item);
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.delete('keyword');
                newSearchParams.set('page', '1');
                navigate(`?${newSearchParams.toString()}`);
              }}
              className='mt-2 px-4 py-2 bg-secondary-20 text-white rounded hover:bg-secondary-40 transition-colors'
            >
              전체 QnA 보기
            </button>
          </div>
        </td>
      </tr>
    )
  ) : (
    qnaData.item.map((item, index) => (
      <QnAListItem
        key={item._id}
        item={item}
        number={totalData - ((currentPage - 1) * limit + index)}
      />
    ))
  );

  return (
    <div className='w-[1200px] mx-auto px-6 mb-20'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        Q&A
      </h1>
      <div className='flex justify-between items-center mb-4'>
        <select
          value={sortOption}
          onChange={(e) => handleSortChange(e)}
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

        {isAdminOrUser && (
          <button
            onClick={() => navigate('/qna/new')}
            className='px-5 py-2 bg-secondary-20 text-white rounded hover:bg-secondary-40 transition-colors'
          >
            질문하기
          </button>
        )}
      </div>
      <div className='w-full mx-auto my-0 max-h-[906.11px] overflow-y-auto'>
        <table className='w-full border-collapse table-fixed'>
          <thead>
            <tr className='border-t border-t-grey-80 border-b-[3px] border-b-grey-10'>
              <th className='py-5 text-left w-[8%] pl-5'>번호</th>
              <th className='py-5 text-left w-[77%] flex justify-center pl-5'>
                제목
              </th>
              <th className='py-5 text-right w-[7%] pr-2.5'>작성자</th>
              <th className='py-5 text-right w-[8%] pr-5'>작성일</th>
            </tr>
          </thead>
          <tbody>{qnaPostList}</tbody>
        </table>
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

            {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
              const pageNum = startPage + i;
              return (
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
              );
            })}

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
          onChange={handleSearchChange}
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
