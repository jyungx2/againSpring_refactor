import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function ListItem({ title, date }) {
  /**
   * TODO:
   * 1. Props 수정
   *    - item prop으로 변경하여 전체 데이터 전달받기
   *    - date를 updatedAt 또는 createdAt으로 표시
   *
   * 2. 날짜 포맷팅
   *    - API 형식(YYYY.MM.DD HH:mm:ss)을 YY/MM/DD로 변환하는 유틸 함수 작성
   *
   * 3. Link 수정
   *    - detail 경로에 게시글 id 추가 (/detail/${item._id})
   */

  return (
    <div className='w-[280px]'>
      <div className='rounded w-[280px] h-[280px] bg-grey-10' />
      <div className='pt-[19px] pl-[10px] w-full'>
        <h3 className='text-xl my-2 mx-0'>
          <strong className='text-red-400 mr-3'>공지사항</strong>
          <Link
            to='detail'
            className='hover:text-secondary-20 transition-colors'
          >
            {title}
          </Link>
        </h3>
        <h4 className='text-grey-70 text-lg m-0'>{date}</h4>
      </div>
    </div>
  );
}

ListItem.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};
