import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function EventListItem({
  number,
  title,
  author,
  date,
  isActive,
}) {
  return (
    <tr className='border-b border-grey-10'>
      <td className='py-5 text-left pl-5'>{number}</td>
      <td className='py-5 text-left pl-5'>
        <Link
          to={""}
          className='hover:text-secondary-20 transition-colors'
        >
          {title}
        </Link>
        <span
          className={`inline-block px-5 py-2 rounded-[20px] text-white text-lg ml-2.5 ${isActive ? 'bg-primary-40' : 'bg-grey-20'
            }`}
        >
          {isActive ? '진행중' : '종료'}
        </span>
      </td>
      <td className='py-5 text-right pr-2.5'>{author}</td>
      <td className='py-5 text-right pr-5'>
        <div className='text-2xl text-center'>{date}</div>
        <div className='text-xl text-center'>00:00:00</div>
      </td>
    </tr>
  );
}

EventListItem.propTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};
