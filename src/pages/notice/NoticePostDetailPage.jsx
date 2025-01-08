import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/fonts.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function NoticePostDetailPage() {
  /**
   * TODO:
   * 1. API 연동
   *    - fetch('/posts/{id}') 호출 구현
   *    - useState로 post 상태 관리 추가
   *    - useEffect로 데이터 fetching
   *    - loading, error 상태 처리
   *
   * 2. 데이터 바인딩
   *    - 제목 -> item.title
   *    - 작성자 -> item.user.name
   *    - 작성일 -> item.updatedAt || item.createdAt
   *    - 조회수 -> item.views
   *    - 내용 -> item.content
   *    - 더미 텍스트 제거
   *
   * 3. 삭제 기능
   *    - deleteCheckBtn 함수에 실제 DELETE API 호출 추가
   *    - 성공/실패 처리
   *    - 삭제 후 목록 페이지로 이동
   *
   * 4. 이전글/다음글
   *    - API에서 이전글/다음글 정보 받아오기
   *    - 네비게이션 링크에 해당 게시글 ID 추가
   */

  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  const deleteCheckBtn = () => {
    MySwal.fire({
      title: '게시글을 삭제하시겠습니까?',
      text: '삭제된 게시글은 복구할 수 없습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '네',
      cancelButtonText: '아니요',
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: '삭제 완료',
          text: '게시글이 삭제되었습니다.',
          confirmButtonText: '확인',
          icon: 'success',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/notice');
          }
        });
      }
    });
  };

  return (
    <div className='w-[1200px] mx-auto px-6 py-4'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        공지사항
      </h1>

      <section className='flex flex-col'>
        {/* 게시글 헤더 */}
        <div className='border-t border-black'>
          <div className='flex items-center gap-[100px] py-4 border-b border-grey-10'>
            <label
              className='text-lg font-medium text-grey-80 w-24'
              htmlFor='title'
            >
              제목
            </label>
            <h2 className='text-xl font-medium text-grey-50' id='title'>
              공지사항 입니다.
            </h2>
          </div>
          <div className='flex items-center gap-[100px] py-4 border-b border-grey-10'>
            <label
              className='text-lg font-medium text-grey-80 w-24'
              htmlFor='writer'
            >
              작성자
            </label>
            <p className='text-xl font-medium text-grey-50' id='writer'>
              다시, 봄
            </p>
          </div>
          <div className='border-b border-grey-10'>
            <div className='flex gap-[43px] py-4'>
              <div className='flex items-center'>
                <label className='text-lg font-medium pl-5 mr-2' htmlFor='date'>
                  작성일
                </label>
                <p className='text-lg text-grey-40' id='date'>
                  2024-01-01 00:00:00
                </p>
              </div>
              <div className='flex items-center'>
                <label className='text-lg font-medium mr-2' htmlFor='views'>
                  조회수
                </label>
                <p className='text-lg text-grey-40' id='views'>
                  0
                </p>
              </div>
            </div>

            {Array.from({ length: 10 }, (_, i) => (
              <p key={i} className='py-4 text-lg'>
                여기에 글 내용이 들어갑니다 {i + 1}번째 줄
              </p>
            ))}
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <div className='border-t border-grey-10 pt-4 pb-2'>
          <div className='flex justify-between mb-4'>
            <button
              type='button'
              className='border border-grey-10 rounded px-9 py-3 text-lg'
            >
              <Link to='/notice'>목록</Link>
            </button>
            <div className='flex gap-3'>
              <button
                type='button'
                className='border border-grey-10 rounded px-9 py-3 text-lg'
              >
                <Link to='/notice/edit'>수정</Link>
              </button>
              <button
                type='button'
                className='border border-grey-10 rounded px-9 py-3 text-lg'
                onClick={() => {
                  deleteCheckBtn();
                }}
              >
                삭제
              </button>
            </div>
          </div>

          <nav className='mb-4'>
            <div className='border-t border-b border-grey-5'>
              <div className='flex items-center border-b border-grey-5 min-h-[60px]'>
                <div className='w-[100px] sm:w-[120px] px-4 py-4 text-grey-50 text-lg font-medium shrink-0'>
                  <span className='text-sm mr-2'>▲</span>이전글
                </div>
                <Link
                  to='#'
                  className='flex-1 px-4 py-4 text-lg text-grey-80 hover:text-secondary-20 truncate'
                >
                  이전 공지글
                </Link>
              </div>
              <div className='flex items-center min-h-[60px]'>
                <div className='w-[100px] sm:w-[120px] px-4 py-4 text-grey-50 text-lg font-medium shrink-0'>
                  <span className='text-sm mr-2'>▼</span>다음글
                </div>
                <Link
                  to='#'
                  className='flex-1 px-4 py-4 text-lg text-grey-80 hover:text-secondary-20 truncate'
                >
                  다음 공지글
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
