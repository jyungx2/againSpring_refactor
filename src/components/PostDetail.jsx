import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosInstance from '@hooks/useAxiosInstance';
import useUserStore from '@store/userStore';
import { useEffect, useState } from 'react';
import { useDeletePost } from '@hooks/useDeletePost';
import CommentList from '@pages/comment/CommentList';
import PropTypes from 'prop-types';

export default function PostDetail({ type = 'notice' }) {
  const { id } = useParams();
  const { user } = useUserStore();
  const axios = useAxiosInstance();

  const { handleDelete } = useDeletePost({
    id,
    queryKey: `${type}Detail`,
    redirectPath: `/${type}`,
  });

  const [navigationLinks, setNavigationLinks] = useState({
    previous: { link: undefined, title: undefined },
    next: { link: undefined, title: undefined },
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [replies, setReplies] = useState([]);
  const [hasAdminReply, setHasAdminReply] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: [`${type}Detail`, id],
    queryFn: () => axios.get(`/posts/${id}`),
    select: (res) => res.data,
  });

  const checkEditPermission = () => {
    if (type === 'notice') {
      return user?.type === 'admin' && user.id === data?.item?.user_id;
    }
    return user?.type === 'admin' || user?._id === data?.item?.user?._id;
  };

  const findItemById = (objectList, searchId) => {
    const index = objectList.findIndex((item) => item._id == searchId);
    return { item: index !== -1 ? objectList[index] : null, index };
  };

  useEffect(() => {
    if (type === 'qna' && data?.item) {
      if (data.item?.product?.name?.[0] && data.item?.product?._id?.[0]) {
        setSelectedProduct({
          ...data.item.product,
          name: data.item.product.name[0],
          _id: data.item.product._id[0],
          mainImages: data.item.product.mainImages[0],
        });
      }

      if (data.item?.replies) {
        setReplies(data.item.replies);
        const adminReplyExists = data.item.replies.some(
          (reply) => reply.user?.email === 'admin@market.com'
        );
        setHasAdminReply(adminReplyExists);
      }
    }

    const findPreNextPostInfo = async (id) => {
      try {
        const response = await axios.get(`/posts`, {
          params: {
            page: 1,
            limit: 100,
            type,
          },
        });

        if (response?.data?.item) {
          const nowIndexData = findItemById(response.data.item, id);
          const itemList = response.data.item;

          setNavigationLinks({
            next:
              nowIndexData.index > 0
                ? {
                    link: `/${type}/detail/${
                      itemList[nowIndexData.index - 1]?._id
                    }`,
                    title: itemList[nowIndexData.index - 1]?.title,
                  }
                : { link: '#', title: '' },
            previous:
              nowIndexData.index < itemList.length - 1
                ? {
                    link: `/${type}/detail/${
                      itemList[nowIndexData.index + 1]?._id
                    }`,
                    title: itemList[nowIndexData.index + 1]?.title,
                  }
                : { link: '#', title: '' },
          });
        }
      } catch (error) {
        console.log(`${type} 게시판 에러발생`, error);
      }
    };

    findPreNextPostInfo(id);
  }, [data, type]);

  if (isLoading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-xl'>로딩중...</div>
      </div>
    );

  if (error)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-xl text-red-500'>에러가 발생했습니다</div>
      </div>
    );

  if (!data?.item)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-xl'>데이터를 찾을 수 없습니다</div>
      </div>
    );

  return (
    <div className='w-[1200px] mx-auto px-6 py-4'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        {type === 'notice' ? '공지사항' : 'Q&A'}
      </h1>

      {type === 'qna' && selectedProduct && (
        <div className='flex items-center mb-4 p-6 border rounded-md w-full'>
          <div className='mr-6 relative'>
            {selectedProduct.mainImages?.length > 0 ? (
              <img
                src={`https://11.fesp.shop${selectedProduct.mainImages[0].path}`}
                className='w-32 h-32 bg-gray-200 flex items-center justify-center text-sm text-gray-600'
                alt={selectedProduct.name}
              />
            ) : (
              <div className='w-32 h-32 bg-gray-200 flex items-center justify-center text-sm text-gray-600'>
                No Image
              </div>
            )}
          </div>
          <div className='flex flex-col gap-4 justify-center h-32'>
            <div className='text-xl'>상품명: {selectedProduct.name}</div>
            <div className='flex gap-4'>
              <button className='px-6 py-2.5 bg-black text-white text-lg rounded hover:bg-gray-800'>
                <Link to={`/detail/${selectedProduct?._id}`}>상품상세보기</Link>
              </button>
            </div>
          </div>
        </div>
      )}

      <section className='flex flex-col'>
        <div className='border-t border-black'>
          <div className='flex items-center gap-[100px] py-4 border-b border-grey-10'>
            <label
              className='text-lg font-medium text-grey-80 w-24'
              htmlFor='title'
            >
              제목
            </label>
            <h2
              className='text-xl font-medium text-grey-50 flex items-center gap-2'
              id='title'
            >
              {data.item.title}
              {type === 'qna' && (
                <span
                  className={`inline-block px-5 py-2 rounded-[20px] text-white text-sm ml-2.5 
                  ${hasAdminReply ? 'bg-primary-40' : 'bg-grey-20'}`}
                >
                  {hasAdminReply ? '답변완료' : '답변대기'}
                </span>
              )}
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
              {data.item.user?.name}
            </p>
          </div>

          <div className='border-b border-grey-10'>
            <div className='flex gap-[43px] py-4'>
              <div className='flex items-center'>
                <label className='text-lg font-medium pl-5 mr-2' htmlFor='date'>
                  작성일
                </label>
                <p className='text-lg text-grey-40' id='date'>
                  {data.item.createdAt}
                </p>
              </div>
              <div className='flex items-center'>
                <label className='text-lg font-medium mr-2' htmlFor='views'>
                  조회수
                </label>
                <p className='text-lg text-grey-40' id='views'>
                  {data.item.views}
                </p>
              </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: data.item.content }}></div>
          </div>
        </div>

        {type === 'qna' && (
          <CommentList
            comments={replies}
            setReplies={setReplies}
            isAdmin={user?.type === 'admin'}
            post={data.item}
          />
        )}

        <div className='border-t border-grey-10 pt-4 pb-2'>
          <div className='flex justify-between mb-4'>
            <button
              type='button'
              className='border border-grey-10 rounded px-9 py-3 text-lg'
            >
              <Link to={`/${type}`}>목록</Link>
            </button>
            {checkEditPermission() && (
              <div className='flex gap-3'>
                <button
                  type='button'
                  className='border border-grey-10 rounded px-9 py-3 text-lg'
                >
                  <Link to={`/${type}/edit/${id}`}>수정</Link>
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

PostDetail.propTypes = {
  type: PropTypes.oneOf(['notice', 'qna']).isRequired,
};
