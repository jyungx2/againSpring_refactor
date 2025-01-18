import { Link, useParams } from 'react-router-dom';
import '../../assets/styles/fonts.css';
import { useQuery } from '@tanstack/react-query';
import useAxiosInstance from '@hooks/useAxiosInstance';
import useUserStore from '@store/userStore';
import { useEffect, useState } from 'react';
import { useDeletePost } from '@hooks/useDeletePost';

export default function NoticePostDetailPage() {
  const { id } = useParams();
  const { handleDelete } = useDeletePost({
    id,
    queryKey: 'noticeDetail',
    redirectPath: '/notice',
  });
  const { user } = useUserStore();

  const axios = useAxiosInstance();

  const [navigationLinks, setNavigationLinks] = useState({
    previous: { link: undefined, title: undefined },
    next: { link: undefined, title: undefined },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['noticeDetail', id],
    queryFn: () => axios.get(`/posts/${id}`),
    select: (res) => res.data,
  });

  const isAuthorizedToEdit = () => {
    if (!user || !data?.item) return false;
    return user.type === 'admin' && user.id === data.item.user_id;
  };

  function findItemById(objectList, searchId) {
    const index = objectList.findIndex((item) => {
      return item._id == searchId;
    });
    return {
      item: index !== -1 ? objectList[index] : null,
      index: index,
    };
  }

  useEffect(() => {
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
            setNavigationLinks((prev) => ({
              ...prev,
              next: {
                link: `/notice/detail/${
                  itemList[Number(nowIndexData.index) - 1]?._id
                }`,
                title: itemList[Number(nowIndexData.index) - 1]?.title,
              },
            }));
          } else {
            setNavigationLinks((prev) => ({
              ...prev,
              next: { link: '#', title: '' },
            }));
          }

          if (nowIndexData.index < itemList.length - 1) {
            setNavigationLinks((prev) => ({
              ...prev,
              previous: {
                link: `/notice/detail/${
                  itemList[Number(nowIndexData.index) + 1]?._id
                }`,
                title: itemList[Number(nowIndexData.index) + 1]?.title,
              },
            }));
          } else {
            setNavigationLinks((prev) => ({
              ...prev,
              previous: { link: '#', title: '' },
            }));
          }
        }
      } catch (error) {
        console.log(`notice 게시판 에러발생`, error);
      }
      return null;
    }

    findPreNextPostInfo(id);
  }, [data]);

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
                  onClick={handleDelete}
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
                  to={navigationLinks.next.link}
                  className='flex-1 px-4 py-4 text-xl text-grey-80 hover:text-secondary-20 truncate'
                >
                  {navigationLinks.next.title || '다음 글이 없습니다'}
                </Link>
              </div>
              <div className='flex items-center min-h-[60px]'>
                <div className='w-[100px] sm:w-[120px] px-4 py-4 text-grey-50 text-xl font-medium shrink-0'>
                  <span className='text-base mr-2'>▼</span>이전글
                </div>
                <Link
                  to={navigationLinks.previous.link}
                  className='flex-1 px-4 py-4 text-xl text-grey-80 hover:text-secondary-20 truncate'
                >
                  {navigationLinks.previous.title || '이전 글이 없습니다'}
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
