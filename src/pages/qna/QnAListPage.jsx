import useUserStore from '@store/userStore';
import '../../assets/styles/fonts.css';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosInstance from '@hooks/useAxiosInstance';
import QnAListItem from './QnAListItem';
import { useState } from 'react';

// 사용자 정보 조회 API 함수
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

  const getSortParamsByOption = (sortOption) => {
    const sortParams = {
      default: undefined,
      'title-asc': JSON.stringify({ title: 1 }), // 오름차순
      'title-desc': JSON.stringify({ title: -1 }), // 내림차순
      'date-asc': JSON.stringify({ createdAt: 1 }),
      'date-desc': JSON.stringify({ createdAt: -1 }),
      'view-asc': JSON.stringify({ views: 1 }),
      'view-desc': JSON.stringify({ views: -1 }),
    };

    return sortParams[sortOption];
  };

  const [sortOption, setSortOption] = useState(() => {
    const sortParam = searchParams.get('sort');
    if (!sortParam) return 'default';
    // URL의 sort 파라미터를 옵션값으로 변환하는 로직
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

  const getPageLink = (pageNum) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNum.toString());
    if (sortOption !== 'default') {
      params.set('sort', getSortParamsByOption(sortOption));
    }
    return `?${params.toString()}`;
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

  if (isUserLoading || isQnaLoading) {
    return <div>로딩중...</div>;
  }

  // 에러 상태 처리
  if (!userData?.item || !qnaData?.item) {
    return <div>데이터를 불러오는데 실패했습니다.</div>;
  }

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);

    // URL 파라미터 업데이트
    const newSearchParams = new URLSearchParams(searchParams);
    if (newSortOption !== 'default') {
      newSearchParams.set('sort', getSortParamsByOption(newSortOption));
    } else {
      newSearchParams.delete('sort');
    }
    navigate(`?${newSearchParams.toString()}`);
  };

  // 현재 로그인한 사용자
  const userType =
    user && userData.item?.find((item) => item._id === user._id)?.type;

  // type이 admin 이거나 user인지 확인
  const isAdminOrUser = userType === 'admin' || userType === 'user';

  const totalData = qnaData.pagination?.total || 0;
  const totalPages = Math.ceil(totalData / limit);
  const currentGroup = Math.ceil(currentPage / PAGES_PER_GROUP);
  const startPage = (currentGroup - 1) * PAGES_PER_GROUP + 1;
  const endPage = Math.min(currentGroup * PAGES_PER_GROUP, totalPages);
  const prevGroupLastPage = startPage - 1;
  const nextGroupFirstPage = endPage + 1;
  const showPrevButton = currentGroup > 1;
  const showNextButton = endPage < totalPages;

  const qnaPostList = qnaData.item.map((item, index) => (
    <QnAListItem
      key={item._id}
      item={item}
      number={totalData - ((currentPage - 1) * limit + index)}
    />
  ));

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
        {/* 페이지네이션 영역 */}
        {totalPages > 1 && ( // 전체 페이지가 1보다 클 때만 표시
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
          <select className='w-full h-[37px] px-2.5 border border-grey-10 rounded bg-white'>
            <option value='title'>제목</option>
            <option value='content'>내용</option>
            <option value='all'>제목+내용</option>
          </select>
        </div>
        <input
          type='text'
          className='h-[37px] py-0 px-3 border border-grey-10 rounded w-[200px]'
        />
        <button
          type='submit'
          className='bg-secondary-20 hover:bg-secondary-40 transition-colors text-white h-[37px] py-0 px-[25px] border-none rounded cursor-pointer leading-[37px]'
        >
          찾기
        </button>
      </div>
    </div>
  );
}
