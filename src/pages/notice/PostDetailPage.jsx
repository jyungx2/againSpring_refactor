import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/fonts.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function PostDetailPage() {
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
            navigate('/qna');
          }
        });
      }
    });
  };

  return (
    <div className='w-[1200px] mx-auto px-6 py-4'>
      <h1 className='text-2xl text-center py-2 mb-4'>공지사항</h1>

      <section className='flex flex-col'>
        {/* 게시글 헤더 */}
        <div className='border-t border-black'>
          <div className='flex items-center gap-[100px] py-3 border-b border-grey-10'>
            <label className='text-sm font-normal text-grey-80' htmlFor='title'>
              제목
            </label>
            <h2 className='text-sm font-normal text-grey-50' id='title'>
              공지사항 입니다.
            </h2>
          </div>
          <div className='flex items-center gap-[100px] py-3 border-b border-grey-10'>
            <label
              className='text-sm font-normal text-grey-80'
              htmlFor='writer'
            >
              작성자
            </label>
            <p className='text-sm font-normal text-grey-50' id='writer'>
              다시, 봄
            </p>
          </div>
          <div className='border-b border-grey-10'>
            <div className='flex gap-[43px] py-3'>
              <div className='flex items-center'>
                <label className='text-sm font-bold pl-5 mr-1' htmlFor='date'>
                  작성일
                </label>
                <p className='text-sm text-grey-40' id='date'>
                  2024-01-01 00:00:00
                </p>
              </div>
              <div className='flex items-center'>
                <label className='text-sm font-bold mr-1' htmlFor='views'>
                  조회수
                </label>
                <p className='text-sm text-grey-40' id='views'>
                  0
                </p>
              </div>
            </div>

            {Array.from({ length: 200 }, (_, i) => (
              <p key={i} className='py-4'>
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
              className='border border-grey-10 rounded px-9 py-2'
            >
              <Link to='/notice'>목록</Link>
            </button>
            <div className='flex gap-3'>
              <button
                type='button'
                className='border border-grey-10 rounded px-9 py-2'
              >
                <Link to='/notice/edit'>수정</Link>
              </button>
              <button
                type='button'
                className='border border-grey-10 rounded px-9 py-2'
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
              <div className='flex items-center border-b border-grey-5 min-h-[48px]'>
                <div className='w-[80px] sm:w-[100px] px-2 sm:px-4 py-3 text-grey-50 text-sm shrink-0'>
                  <span className='text-xs mr-1'>▲</span>이전글
                </div>
                <Link
                  to='#'
                  className='flex-1 px-2 sm:px-4 py-3 text-sm text-grey-80 hover:text-secondary-20 truncate'
                >
                  이전 공지글
                </Link>
              </div>
              <div className='flex items-center min-h-[48px]'>
                <div className='w-[80px] sm:w-[100px] px-2 sm:px-4 py-3 text-grey-50 text-sm shrink-0'>
                  <span className='text-xs mr-1'>▼</span>다음글
                </div>
                <Link
                  to='#'
                  className='flex-1 px-2 sm:px-4 py-3 text-sm text-grey-80 hover:text-secondary-20 truncate'
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
