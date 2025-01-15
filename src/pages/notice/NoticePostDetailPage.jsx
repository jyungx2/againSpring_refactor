import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/fonts.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosInstance from '@hooks/useAxiosInstance';
import useUserStore from '@store/userStore';
import { useEffect, useState } from 'react';

export default function NoticePostDetailPage() {
  const axios = useAxiosInstance();
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { user } = useUserStore();

  const [previousNumberLink, setPreviousNumberLink] = useState();
  const [previousTitle, setPreviousTitle] = useState();
  const [nextNumberLink, setNextNumberLink] = useState();
  const [nextTitle, setNextTitle] = useState();

  const { data, isLoading, error } = useQuery({
    queryKey: ['noticeDetail', id],
    queryFn: () => axios.get(`/posts/${id}`),
    select: (res) => res.data,
  });

  // 현재 사용자가 관리자이고 게시글 작성자인지 확인하는 함수
  const isAuthorizedToEdit = () => {
    if (!user || !data?.item) return false;
    return user.type === 'admin' && user.id === data.item.user_id;
  };

  useEffect(() => {
    // 이전글 다음글 찾는 로직
    async function findPreNextPostInfo(id) {
      try {
        const response = await axios.get(`/posts`, {
          params: {
            page: 1,
            limit: 100,
            type: 'notice',
          },
        });
        if (response?.data && response?.data?.item) {
          const nowIndexData = findItemById(response.data.item, id);
          const itemList = response?.data?.item;

          if (nowIndexData.index > 0) {
            // 이전글 구하기
            setNextNumberLink(
              `/notice/detail/${itemList[Number(nowIndexData.index) - 1]?._id}`
            );
            setNextTitle(`${itemList[Number(nowIndexData.index) - 1]?.title}`);
          } else {
            setNextNumberLink(`#`);
            setNextTitle('');
          }

          if (nowIndexData.index < itemList.length - 1) {
            setPreviousNumberLink(
              `/notice/detail/${itemList[Number(nowIndexData.index) + 1]?._id}`
            );
            setPreviousTitle(
              `${itemList[Number(nowIndexData.index) + 1]?.title}`
            );
          } else {
            setPreviousNumberLink(`#`);
            setPreviousTitle('');
          }
        }
      } catch (error) {
        console.log(`notice 게시판 에러발생`, error);
      }
      return null;
    }

    findPreNextPostInfo(id);
  }, [data]);

  // 두 가지 모두 제공하는 유틸리티 함수
  function findItemById(objectList, searchId) {
    const index = objectList.findIndex((item) => {
      return item._id == searchId;
    });
    return {
      item: index !== -1 ? objectList[index] : null,
      index: index,
    };
  }

  // 게시글 삭제
  const deletePost = useMutation({
    mutationFn: () => axios.delete(`/posts/${id}`),
    onSuccess: () => {
      // 상세 페이지 쿼리는 삭제하고, 목록 쿼리만 무효화
      queryClient.removeQueries(['noticeDetail', id]);
      queryClient.invalidateQueries(['posts']);
      MySwal.fire({
        title: '삭제 완료',
        text: '게시글이 삭제되었습니다.',
        icon: 'success',
        confirmButtonText: '확인',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/notice');
        }
      });
    },
  });

  const deleteCheckBtn = async () => {
    const result = await MySwal.fire({
      title: '게시글을 삭제하시겠습니까?',
      text: '삭제된 게시글은 복구할 수 없습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '네',
      cancelButtonText: '아니요',
    });

    if (result.isConfirmed) {
      deletePost.mutate();
    }
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

  if (!data?.item) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-xl'>데이터를 찾을 수 없습니다</div>
      </div>
    );
  }

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
              {data?.item?.title}
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
              {data?.item?.user?.name}
            </p>
          </div>
          <div className='border-b border-grey-10'>
            <div className='flex gap-[43px] py-4'>
              <div className='flex items-center'>
                <label className='text-lg font-medium pl-5 mr-2' htmlFor='date'>
                  작성일
                </label>
                <p className='text-lg text-grey-40' id='date'>
                  {data?.item?.createdAt}
                </p>
              </div>
              <div className='flex items-center'>
                <label className='text-lg font-medium mr-2' htmlFor='views'>
                  조회수
                </label>
                <p className='text-lg text-grey-40' id='views'>
                  {data?.item?.views}
                </p>
              </div>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: data?.item?.content }}
            ></div>
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
            {isAuthorizedToEdit() && (
              <div className='flex gap-3'>
                <button
                  type='button'
                  className='border border-grey-10 rounded px-9 py-3 text-lg'
                >
                  <Link to={`/notice/edit/${id}`}>수정</Link>
                </button>
                <button
                  type='button'
                  className='border border-grey-10 rounded px-9 py-3 text-lg'
                  onClick={deleteCheckBtn}
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          <nav className='mb-4'>
            <div className='border-t border-b border-grey-5'>
              <div className='flex items-center border-b border-grey-5 min-h-[60px]'>
                <div className='w-[100px] sm:w-[120px] px-4 py-4 text-grey-50 text-xl font-medium shrink-0'>
                  <span className='text-base mr-2'>▲</span>다음글
                </div>
                <Link
                  to={nextNumberLink}
                  className='flex-1 px-4 py-4 text-xl text-grey-80 hover:text-secondary-20 truncate'
                >
                  {nextTitle || '다음 글이 없습니다'}
                </Link>
              </div>
              <div className='flex items-center min-h-[60px]'>
                <div className='w-[100px] sm:w-[120px] px-4 py-4 text-grey-50 text-xl font-medium shrink-0'>
                  <span className='text-base mr-2'>▼</span>이전글
                </div>
                <Link
                  to={previousNumberLink}
                  className='flex-1 px-4 py-4 text-xl text-grey-80 hover:text-secondary-20 truncate'
                >
                  {previousTitle || '이전 글이 없습니다'}
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
