import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

export default function NoticeListItem({ item }) {
  // content에서 첫 번째 이미지 URL 추출
  const firstImageUrl = useMemo(() => {
    if (!item.content) return null;

    try {
      // Quill content에서 첫 번째 img 태그의 src 추출을 위한 정규식
      const imgRegex = /<img[^>]+src="([^">]+)"/;
      const match = item.content.match(imgRegex);

      // 매칭된 이미지 URL이 없으면 반환
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
          <img
            src={firstImageUrl}
            alt={item.title}
            className='w-full h-full object-cover rounded'
            onError={(e) => {
              e.target.parentElement.classList.add('bg-grey-10');
              e.target.style.display = 'none';
            }}
          />
        ) : (
          // 이미지가 없는 경우 기본 배경색 표시
          <div className='w-full h-full bg-grey-10 rounded' />
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
