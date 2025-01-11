import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/fonts.css';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import useAxiosInstance from '@hooks/useAxiosInstance';
import CommentList from '@pages/comment/CommentList';
import { useEffect, useState } from 'react';
import useUserStore from '@store/userStore';

export default function QnAPostDetailPage() {
  const axios = useAxiosInstance();
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [replies, setReplies] = useState([]);
  const { id } = useParams();

  const { user } = useUserStore();
  const isAdmin = user?.type === 'admin';

  const { data, isLoading, error } = useQuery({
    queryKey: ['qnaDetail', id],
    queryFn: () => axios.get(`/posts/${id}`),
    select: (res) => res.data,
  });

  useEffect(() => {
    if (data?.item?.replies) {
      setReplies(data?.item?.replies);
    }
  }, [data]);

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

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-xl'>로딩중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-xl text-red-500'>에러가 발생했습니다</div>
      </div>
    );
  }

  return (
    <div className='w-[1200px] mx-auto px-6 py-4'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        Q&A
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
              {data?.item?.title}
              <span className='inline-block px-5 py-2 rounded-[20px] text-white text-base bg-grey-20'>
                {data?.item?.repliesCount ? '답변완료' : '답변대기'}
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
              {data?.item?.user?.name}
            </p>
          </div>
          <div className='border-b border-grey-10'>
            <div className='flex gap-[43px] py-4'>
              <div className='flex items-center'>
                <label className='text-xl font-medium pl-5 mr-2' htmlFor='date'>
                  작성일
                </label>
                <p className='text-xl text-grey-40' id='date'>
                  {data?.item?.createdAt}
                </p>
              </div>
              <div className='flex items-center'>
                <label className='text-xl font-medium mr-2' htmlFor='views'>
                  조회수
                </label>
                <p className='text-xl text-grey-40' id='views'>
                  {data?.item?.views}
                </p>
              </div>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: data?.item?.content }}
            ></div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <CommentList
          comments={replies}
          setReplies={setReplies}
          isAdmin={isAdmin}
          post={data.item}
        />

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
