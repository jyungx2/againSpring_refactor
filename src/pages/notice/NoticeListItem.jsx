import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

export default function NoticeListItem({ item }) {
  const firstImageUrl = useMemo(() => {
    if (!item.content) return null;

    try {
      const imgRegex = /<img[^>]+src="([^">]+)"/;
      const match = item.content.match(imgRegex);

      return match ? match[1] : null;
    } catch (error) {
      console.error('에러: ', error);
      return null;
    }
  }, [item.content]);
  return (
    <div className='w-[280px]'>
      <div className='rounded w-[280px] h-[280px] bg-grey-10 overflow-hidden'>
        {firstImageUrl ? (
          <div className='relative w-full h-full'>
            <img
              src={firstImageUrl}
              alt={item.title}
              className='w-full h-full object-cover rounded blur-sm'
              onError={(e) => {
                e.target.parentElement.classList.add('bg-grey-10');
                e.target.style.display = 'none';
              }}
            />
            <div className='absolute inset-0 flex flex-col items-center justify-center gap-4'>
              <div className='w-40 h-0.5 bg-white'></div>
              <h1 className='text-4xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-center line-clamp-3 overflow-hidden'>
                {item.title}
              </h1>
              <div className='w-40 h-0.5 bg-white'></div>
            </div>
          </div>
        ) : (
          <div className='relative'>
            <img src='./images/notice-list-img.png' className='blur-sm' />
            <div className='absolute inset-0 flex flex-col items-center justify-center gap-4'>
              <div className='w-40 h-0.5 bg-white'></div>
              <h1 className='text-4xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-center line-clamp-2 overflow-hidden'>
                {item.title}
              </h1>
              <div className='w-40 h-0.5 bg-white'></div>
            </div>
          </div>
        )}
      </div>
      <div className='pt-[19px] pl-[10px] w-full'>
        <h3 className='text-xl my-2 mx-0'>
          <strong className='text-red-400 mr-3'>공지사항</strong>
          <Link
            to={`/notice/detail/${item._id}`}
            className='hover:text-secondary-20 transition-colors'
          >
            {item.title}
          </Link>
        </h3>
        <h4 className='text-grey-70 text-lg m-0'>
          {item.createdAt.split(' ')[0]}
        </h4>
      </div>
    </div>
  );
}

NoticeListItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};
