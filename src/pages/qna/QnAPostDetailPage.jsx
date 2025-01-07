import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/fonts.css';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

export default function QnAPostDetailPage() {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  // 관리자 여부 체크 (실제 구현 시에는 상태 관리나 context에서 가져와야 함)
  const isAdmin = false;

  // 댓글 작성 시도 시 관리자 체크
  const handleCommentSubmit = () => {
    if (!isAdmin) {
      MySwal.fire({
        title: '권한 없음',
        text: '관리자만 댓글을 작성할 수 있습니다.',
        icon: 'warning',
        confirmButtonText: '확인',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    // 관리자인 경우 댓글 작성 로직 실행
  };

  // 게시글 삭제
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
            navigate('/qna');
          }
        });
      }
    });
  };

  return (
    <div className='w-[1200px] mx-auto px-6 py-4'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        Q&amp;A
      </h1>

      <section className='flex flex-col'>
        {/* 게시글 헤더 */}
        <div className='border-t border-black'>
          <div className='flex items-center gap-[100px] py-4 border-b border-grey-10'>
            <label
              className='text-xl font-medium text-grey-80 w-24'
              htmlFor='title'
            >
              제목
            </label>
            <h2
              className='text-2xl font-medium text-grey-50 flex items-center gap-2'
              id='title'
            >
              피그마 너무 어려운데요.
              <span className='inline-block px-5 py-2 rounded-[20px] text-white text-base bg-grey-20'>
                답변대기
              </span>
            </h2>
          </div>
          <div className='flex items-center gap-[100px] py-4 border-b border-grey-10'>
            <label
              className='text-xl font-medium text-grey-80 w-24'
              htmlFor='writer'
            >
              작성자
            </label>
            <p className='text-2xl font-medium text-grey-50' id='writer'>
              홍길동
            </p>
          </div>
          <div className='border-b border-grey-10'>
            <div className='flex gap-[43px] py-4'>
              <div className='flex items-center'>
                <label className='text-xl font-medium pl-5 mr-2' htmlFor='date'>
                  작성일
                </label>
                <p className='text-xl text-grey-40' id='date'>
                  2024-01-01 00:00:00
                </p>
              </div>
              <div className='flex items-center'>
                <label className='text-xl font-medium mr-2' htmlFor='views'>
                  조회수
                </label>
                <p className='text-xl text-grey-40' id='views'>
                  0
                </p>
              </div>
            </div>

            {Array.from({ length: 10 }, (_, i) => (
              <p key={i} className='py-4 text-xl'>
                여기에 글 내용이 들어갑니다 {i + 1}번째 줄
              </p>
            ))}
          </div>
        </div>

        {/* 댓글 섹션 */}
        <section className='mb-8'>
          {/* 댓글 입력 */}
          <div className='flex flex-col gap-4 border border-grey-5 p-6 mb-6'>
            <textarea
              className='w-full min-h-[80px] resize-y border border-grey-30 p-2 text-xl'
              placeholder='관리자만 작성하실 수 있습니다.'
              id='reply-text'
              disabled={!isAdmin}
            />
            <div className='flex justify-end'>
              <button
                type='submit'
                className={`rounded-lg px-6 py-2 text-xl ${
                  isAdmin
                    ? 'bg-secondary-20 text-white'
                    : 'bg-grey-20 text-grey-50 cursor-not-allowed'
                }`}
                onClick={handleCommentSubmit}
              >
                작성
              </button>
            </div>
          </div>
        </section>

        {/* 하단 네비게이션 */}
        <div className='border-t border-grey-10 pt-8 pb-4'>
          <div className='flex justify-between mb-5'>
            <button
              type='button'
              className='border border-grey-10 rounded px-9 py-2 text-xl'
            >
              <Link to='/qna'>목록</Link>
            </button>
            <div className='flex gap-3'>
              <button
                type='button'
                className='border border-grey-10 rounded px-9 py-2 text-xl'
              >
                <Link to='/qna/edit'>수정</Link>
              </button>
              <button
                type='button'
                className='border border-grey-10 rounded px-9 py-2 text-xl'
                onClick={deleteCheckBtn}
              >
                삭제
              </button>
            </div>
          </div>

          <nav className='mb-4'>
            <div className='border-t border-b border-grey-5'>
              <div className='flex items-center border-b border-grey-5 min-h-[60px]'>
                <div className='w-[100px] sm:w-[120px] px-4 py-4 text-grey-50 text-xl font-medium shrink-0'>
                  <span className='text-base mr-2'>▲</span>이전글
                </div>
                <Link
                  to='#'
                  className='flex-1 px-4 py-4 text-xl text-grey-80 hover:text-secondary-20 truncate'
                >
                  이전 공지글
                </Link>
              </div>
              <div className='flex items-center min-h-[60px]'>
                <div className='w-[100px] sm:w-[120px] px-4 py-4 text-grey-50 text-xl font-medium shrink-0'>
                  <span className='text-base mr-2'>▼</span>다음글
                </div>
                <Link
                  to='#'
                  className='flex-1 px-4 py-4 text-xl text-grey-80 hover:text-secondary-20 truncate'
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
