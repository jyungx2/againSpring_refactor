import { Link } from 'react-router-dom';
import ListItem from './ListItem';

export default function ListPage() {
  /**
   * TODO:
   * 1. API 연동
   *    - fetch('/posts?type=info') 호출 구현
   *    - useState로 posts 상태 관리 추가
   *    - useEffect로 데이터 fetching
   *    - loading, error 상태 처리 ?
   *
   * 2. 페이지네이션
   *    - 현재 하드코딩된 버튼을 API 응답 기반으로 동적 생성
   *    - page 파라미터 처리
   *
   * 3. 검색 기능
   *    - 검색 API 연동 (/posts?type=info&search=검색어)
   *    - select와 input의 검색 조건 처리
   */

  // 실제로는 API에서 받아올 데이터
  const items = [
    {
      id: 1,
      title: '연말 휴무 및 택배 없는 날 안내',
      date: '24/12/30',
    },
    {
      id: 2,
      title: '1월 신년 이벤트 안내',
      date: '24/01/02',
    },
    {
      id: 3,
      title: '웹사이트 개편 안내',
      date: '24/01/01',
    },
    {
      id: 4,
      title: '신규 상품 출시 안내',
      date: '23/12/28',
    },
  ];

  return (
    <div className='w-[1200px] mx-auto px-6 mb-20'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        공지사항
      </h1>
      <div className='flex justify-end mb-5 w-full'>
        <Link
          to='/notice/new'
          className='px-5 py-2 bg-secondary-20 text-white rounded hover:bg-secondary-40 transition-colors'
        >
          글쓰기
        </Link>
      </div>
      <div className='grid grid-cols-[repeat(4,280px)] justify-center gap-6 w-[calc(4_*_280px_+_3_*_24px)] mx-auto my-0'>
        {items.map((item) => (
          <ListItem key={item.id} title={item.title} date={item.date} />
        ))}
      </div>

      <div className='justify-center mb-[16px] flex gap-[16px] mt-10'>
        <button className='bg-secondary-20 text-white w-[40px] py-[8px] rounded-md text-[15px] text-center hover:bg-secondary-40'>
          1
        </button>
        <button className='bg-grey-20 text-black w-[40px] py-[8px] rounded-md text-[15px] text-center hover:bg-grey-30'>
          2
        </button>
        <button className='bg-grey-20 text-black w-[40px] py-[8px] rounded-md text-[15px] text-center hover:bg-grey-30'>
          3
        </button>
        <button className='bg-grey-20 text-black w-[60px] py-[8px] rounded-md text-[15px] text-center hover:bg-grey-30'>
          Next
        </button>
      </div>

      <div className='pt-10 flex justify-center gap-[5.4px] h-[70.67px]'>
        <div className='relative w-[120px]'>
          <select className='w-full h-[37px] px-2.5 border border-grey-10 rounded bg-white'>
            <option value='title'>제목</option>
            <option value='date'>작성일</option>
            <option value='author'>작성자</option>
          </select>
        </div>
        <input
          type='text'
          className='h-[37px] py-0 px-3 border border-grey-10 rounded w-[200px]'
        />
        <button
          type='submit'
          className='bg-secondary-20 hover:bg-secondary-40 transition-colors text-white h-[37px] py-0 px-[25px] border-none rounded cursor-pointer leading-[37px]'
        >
          찾기
        </button>
      </div>
    </div>
  );
}
