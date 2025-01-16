import useUserStore from '@store/userStore';
import '../../assets/styles/fonts.css';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import useAxiosInstance from '@hooks/useAxiosInstance';
import QnAListItem from './QnAListItem';

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

  const { data: userData } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => fetchUserInfo(axios),
  });

  const { data } = useQuery({
    queryKey: ['posts', 'qna', currentPage],
    queryFn: () =>
      axios.get('/posts', {
        params: {
          type: 'qna',
          page: currentPage,
          limit,
        },
      }),
    select: (res) => res.data,
    staleTime: 1000 * 10,
  });

  const MySwal = withReactContent(Swal);

  const questionButton = () => {
    if (!user) {
      MySwal.fire({
        title: '로그인이 필요합니다.',
        text: ' 로그인 페이지로 이동하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네',
        cancelButtonText: '아니요',
      }).then((result) => {
        if (result.isConfirmed) {
          MySwal.fire({
            title: '알림',
            text: '로그인 페이지로 이동합니다',
            confirmButtonText: '확인',
            icon: 'info',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/login');
            }
          });
        }
      });
    } else {
      // 현재 로그인한 사용자의 type
      const currentUserType = userData?.item.find(
        (item) => item._id === user._id
      )?.type;

      if (currentUserType !== 'user') {
        MySwal.fire({
          title: '권한이 없습니다',
          text: '일반 회원만 질문을 작성할 수 있습니다',
          icon: 'error',
        });
      } else {
        navigate('/qna/new');
      }
    }
  };

  // 데이터 로딩 중일 때 표시할 UI
  if (!data) {
    return <div>로딩중...</div>;
  }

  const totalData = data?.pagination?.total;
  const totalPages = Math.ceil(totalData / limit);
  const currentGroup = Math.ceil(currentPage / PAGES_PER_GROUP);
  const startPage = (currentGroup - 1) * PAGES_PER_GROUP + 1;
  const endPage = Math.min(currentGroup * PAGES_PER_GROUP, totalPages);
  const prevGroupLastPage = startPage - 1;
  const nextGroupFirstPage = endPage + 1;
  const showPrevButton = currentGroup > 1;
  const showNextButton = endPage < totalPages;

  const qnaPostList = data.item.map((item, index) => (
    <QnAListItem
      key={item._id}
      item={item}
      number={data.pagination.total - ((currentPage - 1) * limit + index)}
    />
  ));

  return (
    <div className='w-[1200px] mx-auto px-6 mb-20'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        Q&A
      </h1>

      <div className='flex justify-end mb-5 w-full'>
        <button
          onClick={questionButton}
          className='px-5 py-2 bg-secondary-20 text-white rounded hover:bg-secondary-40 transition-colors'
        >
          질문하기
        </button>
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
                to={`?page=${prevGroupLastPage}`}
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
                  to={`?page=${pageNum}`}
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
                to={`?page=${nextGroupFirstPage}`}
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
            <option value='date'>작성일</option>
            <option value='author'>작성자</option>
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
