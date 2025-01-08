// import { Link } from 'react-router-dom';
import useUserStore from '@store/userStore';
import '../../assets/styles/fonts.css';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const { user } = useUserStore();
  const axios = useAxiosInstance();

  const { data: userData } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => fetchUserInfo(axios),
  });

  // console.log('userDate는 ', userData);
  // console.log('userDate 첫번째 회원의 type은 ', userData?.item[0]?.type);
  // console.log(
  //   'userDate 모든 회원의 type은 ',
  //   userData?.item.map((user) => user.type)
  // );

  /**
   * TODO 게시판 목록 조회하기
   * 1. {{url}}/posts?type=qna
   * 2. 제목(title), 작성자(user.name), 작성일(createdAt, updatedAt 중 가장 최근 날짜에 작성된 것으로)
   * 3. React Query를 사용해 게시글 목록 데이터 fetch
   * 4. 게시글 목록을 ListItem 컴포넌트로 매핑
   */
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

  // TODO 글 번호는 오름차순으로, 작성일은 내림차순으로 정렬하기 (완료)

  const qnaPostList = data.item.map((item, index) => (
    <QnAListItem key={item._id} item={item} number={data.item.length - index} />
  ));

  const MySwal = withReactContent(Swal);

  /**
   * TODO 비 로그인 상태이면 로그인 페이지로 이동
   * 1. userStore import 하기(완료)
   * 2. useUserStore hook으로부터 user 상태 가져오기(완료)
   * 3. onClick 핸들러 함수 작성하기(완료)
   * 4. Link 컴포넌트를 button으로 변경하기(완료)
   * 5. button에 onClick 핸들러 연결하기(완료)
   * 6. navigate import 하기(완료)
   * 7. useNavigate hook 사용(아직 구현 안 함)
   */

  /**
   * TODO 로그인 상태인데 type=user가 아니면 권한 없음 처리
   * 1. axios instance import 하기(완료)
   * 2. React Query의 useQuery hook import 하기(완료)
   * 3. 사용자 정보 조회 API 함수 작성하기(완료)
   * 4. useQuery로 사용자 정보 가져오기(완료)
   * 5. questionButton 함수에서 권한 체크 로직 추가하기 (완료)
   *   - 비 로그인 -> 로그인 페이지 이동 (기존 로직 유지)
   *   - 로그인 & type !== 'user' -> 권한 없음 alert
   *   - 로그인 & type === 'user' -> 글쓰기 페이지로 이동
   */

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
