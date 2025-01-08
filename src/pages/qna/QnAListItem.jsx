import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function QnAListItem({ item, number }) {
  const detailPath =
    item.title === '상품' ? '/qna/product/detail' : '/qna/detail';
  return (
    <tr className='border-b border-grey-10'>
      <td className='py-5 text-left pl-5'>{number}</td>

      <td className='py-5 text-left pl-5'>
        <Link
          to={detailPath}
          className='hover:text-secondary-20 transition-colors'
        >
          {item.title}
        </Link>
        <span
          className={`inline-block px-5 py-2 rounded-[20px] text-white text-sm ml-2.5 ${
            item.repliesCount ? 'bg-primary-40' : 'bg-grey-20'
          }`}
        >
          {item.repliesCount ? '답변완료' : '답변대기'}
        </span>
      </td>
      <td className='py-5 text-right pr-2.5'>{item.user.name}</td>
      <td className='py-5 text-right pr-5'>
        <div className='text-2xl'>{item.createdAt}</div>
      </td>
    </tr>
  );
}

QnAListItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.number.isRequired,
    title: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    createdAt: PropTypes.string.isRequired,
    repliesCount: PropTypes.number.isRequired,
  }),
  number: PropTypes.number.isRequired,
};
