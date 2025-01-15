import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import useAxiosInstance from '@hooks/useAxiosInstance';

const QnAListItem = ({ item, number }) => {
  const axios = useAxiosInstance();

  // 댓글 목록을 조회하는 쿼리
  const { data: repliesData } = useQuery({
    queryKey: ['replies', item._id],
    queryFn: () => axios.get(`/posts/${item._id}/replies`),
    select: (res) => res.data,
    staleTime: 1000 * 60, // 1분
    cacheTime: 1000 * 60 * 5, // 5분
  });

  // 관리자 답변 여부 확인
  const hasAdminReply = repliesData?.item?.some(
    (reply) => reply.user?.email === 'admin@market.com'
  );

  return (
    <tr className='border-b border-grey-10 hover:bg-grey-5'>
      <td className='py-5 text-left pl-5'>{number}</td>
      <td>
        <Link
          to={
            item.product_id
              ? `/qna/product/detail/${item._id}`
              : `/qna/detail/${item._id}`
          }
          className='flex items-center py-5 pl-5 gap-2'
        >
          {item.product && item.product.image && (
            <img
              src={`https://11.fesp.shop${item.product.image.path}`}
              alt={item.product.name}
              className='w-20 h-20 object-cover'
            />
          )}
          <div className='flex items-center gap-2'>
            {item.title}
            <span
              className={`inline-block px-5 py-2 rounded-[20px] text-white text-sm ${
                hasAdminReply ? 'bg-primary-40' : 'bg-grey-20'
              }`}
            >
              {hasAdminReply ? '답변완료' : '답변대기'}
            </span>
          </div>
        </Link>
      </td>
      <td className='py-5 text-right pr-2.5'>{item.user?.name}</td>
      <td className='py-5 text-right pr-5'>{item.createdAt.split(' ')[0]}</td>
    </tr>
  );
};

export default QnAListItem;

QnAListItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    createdAt: PropTypes.string.isRequired,
    product_id: PropTypes.number,
    product: PropTypes.shape({
      image: PropTypes.shape({
        path: PropTypes.string.isRequired,
      }),
      name: PropTypes.string,
    }),
  }).isRequired,
  number: PropTypes.number.isRequired,
};
