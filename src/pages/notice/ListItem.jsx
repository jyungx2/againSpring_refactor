import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function ListItem({ title, date }) {
  return (
    <div className='w-[280px]'>
      <div className='rounded w-[280px] h-[280px] bg-grey-10' />
      <div className='pt-[19px] pl-[10px] w-full'>
        <h3 className='text-base my-2 mx-0'>
          <Link
            to='detail'
            className='hover:text-secondary-20 transition-colors'
          >
            {title}
          </Link>
        </h3>
        <h4 className='text-grey-50 text-sm m-0'>{date}</h4>
      </div>
    </div>
  );
}

ListItem.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};
