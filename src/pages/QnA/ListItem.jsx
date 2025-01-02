import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function ListItem({ number, title, author, date, isAnswered }) {
  return (
    <tr className='border-b border-grey-10'>
      <td className='py-5 text-left pl-5'>{number}</td>
      <td className='py-5 text-left pl-5'>
        <Link to='detail' className='hover:text-secondary-20 transition-colors'>
          {title}
        </Link>
        <span
          className={`inline-block px-5 py-2 rounded-[20px] text-white text-sm ml-2.5 ${
            isAnswered ? 'bg-primary-40' : 'bg-grey-20'
          }`}
        >
          {isAnswered ? '답변완료' : '답변대기'}
        </span>
      </td>
      <td className='py-5 text-right pr-2.5'>{author}</td>
      <td className='py-5 text-right pr-5'>
        <div>{date}</div>
        <div>00:00:00</div>
      </td>
    </tr>
  );
}

ListItem.propTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  isAnswered: PropTypes.bool.isRequired,
};
