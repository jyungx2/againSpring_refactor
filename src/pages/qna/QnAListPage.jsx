// import { Link } from 'react-router-dom';
import useUserStore from '@store/userStore';
import '../../assets/styles/fonts.css';
import { useNavigate } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import useAxiosInstance from '@hooks/useAxiosInstance';
import QnAListItem from './QnAListItem';

/**
 * TODO: QnA 게시물 상세페이지 분기 처리 구현 순서
 * 1. QnAListItem 컴포넌트 수정
 *    - product_id 유무에 따른 Link path 분기 처리
 *    - const detailPath = item.product_id ? `/qna/product/${item._id}` : `/qna/${item._id}`;
 *
 * 2. 라우터 설정 추가 (App.jsx 또는 라우터 설정 파일)
 *    - /qna/:id -> QnAPostDetailPage
 *    - /qna/product/:id -> ProductQnAPostDetailPage
 *
 * 3. 상세페이지 컴포넌트에서 데이터 fetching 로직 구현
 *    - useParams로 id 파라미터 가져오기
 *    - useQuery로 상세 데이터 조회
 *    - const { data } = useQuery({
 *        queryKey: ['qnaDetail', id],
 *        queryFn: () => axios.get(`/posts/${id}`),
 *        select: (res) => res.data
 *      });
 *
 * 4. 로딩 상태 처리
 *    - if (isLoading) return <div>로딩중...</div>;
 *
 * 5. 에러 상태 처리
 *    - if (error) return <div>에러가 발생했습니다</div>;
 *
 * 6. product_id가 있는 경우 상품 정보 표시
 *    - selectedProductInfo 상태를 실제 product 데이터로 설정
 */

// 사용자 정보 조회 API 함수
const fetchUserInfo = async (axios) => {
  const response = await axios.get('/users');
  return response.data;
};

export default function QnAListPage() {
  const navigate = useNavigate();

  const { user } = useUserStore();
  const axios = useAxiosInstance();

  const { data: userData } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => fetchUserInfo(axios),
  });

  const { data } = useQuery({
    queryKey: ['posts', 'qna'],
    queryFn: () => axios.get('/posts', { params: { type: 'qna' } }),
    select: (res) => res.data,
    staleTime: 1000 * 10,
  });

  console.log('qna 게시판 글 목록', data);

  // 데이터 로딩 중일 때 표시할 UI
  if (!data) {
    return <div>로딩중...</div>;
  }

  const qnaPostList = data.item.map((item, index) => (
    <QnAListItem key={item._id} item={item} number={data.item.length - index} />
  ));

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
        <button className='bg-secondary-20 text-white w-[40px] py-[8px] rounded-md text-[15px] text-center hover:bg-secondary-40'>
          1
        </button>
        <button className='bg-grey-20 text-black w-[40px] py-[8px] rounded-md text-[15px] text-center hover:bg-grey-30'>
          2
        </button>
        <button className='bg-grey-20 text-black w-[40px] py-[8px] rounded-md text-[15px] text-center hover:bg-grey-30'>
          3
        </button>
        <button className='bg-grey-20 text-black w-[60px] py-[8px] rounded-md text-[15px] text-center hover:bg-grey-30'>
          Next
        </button>
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
