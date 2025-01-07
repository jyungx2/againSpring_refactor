import { Link } from 'react-router-dom';
import '../../assets/styles/fonts.css';
import ListItem from './QnAListItem';

export default function QnAListPage() {
  // 실제로는 API에서 받아올 데이터
  const items = [
    {
      number: 4,
      title: '피그마 너무 어려운데요.',
      author: '홍길동',
      date: '2024-01-01',
      isAnswered: true,
    },
    {
      number: 3,
      title: '피그마 너무 어려운데요.',
      author: '홍길동',
      date: '2024-01-01',
      isAnswered: false,
    },
    {
      number: 2,
      title: '피그마 너무 어려운데요.',
      author: '홍길동',
      date: '2024-01-01',
      isAnswered: true,
    },
    {
      number: 1,
      title: '피그마 너무 어려운데요.',
      author: '홍길동',
      date: '2024-01-01',
      isAnswered: false,
    },
  ];

  return (
    <div className='container mx-auto px-6 mb-20'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        Q&amp;A
      </h1>

      <div className='flex justify-end mb-5 w-full'>
        <Link
          to='/qna/new'
          className='px-5 py-2 bg-secondary-20 text-white rounded hover:bg-secondary-40 transition-colors'
        >
          질문하기
        </Link>
      </div>
      <div className='w-full mx-auto my-0 max-h-[906.11px] overflow-y-auto'>
        <table className='w-full border-collapse table-fixed'>
          <thead>
            <tr className='border-t border-t-grey-80 border-b-[3px] border-b-grey-10'>
              <th className='py-5 text-left w-[8%] pl-5'>번호</th>
              <th className='py-5 text-left w-[77%] flex justify-center pl-5'>
                제목
              </th>
              <th className='py-5 text-right w-[7%] pr-2.5'>작성자</th>
              <th className='py-5 text-right w-[8%] pr-5'>작성일</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <ListItem
                key={item.number}
                number={item.number}
                title={item.title}
                author={item.author}
                date={item.date}
                isAnswered={item.isAnswered}
              />
            ))}
          </tbody>
        </table>
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
