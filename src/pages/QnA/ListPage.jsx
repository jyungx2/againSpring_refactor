import { Link } from 'react-router-dom';
import '../../assets/styles/fonts.css';

export default function ListPage() {
  return (
    <div className='container mx-auto px-6 mb-20'>
      <h1 className='h-[63px] text-2xl text-center box-border m-0 px-0 py-[15px]'>
        Q&amp;A
      </h1>
      <div className='flex justify-end mb-5 w-full'>
        <button className='px-5 py-2 bg-secondary-20 text-white rounded hover:bg-secondary-40 transition-colors'>
          <Link to='new'>질문하기</Link>
        </button>
      </div>
      <div className='w-full mx-auto my-0 max-h-[906.11px] overflow-y-auto'>
        <table className='w-full border-collapse table-fixed'>
          <thead>
            <tr className='border-t border-t-grey-80 border-b-[3px] border-b-grey-10'>
              <th className='py-5 text-left w-[8%] pl-5'>번호</th>
              <th className='py-5 text-left w-[77%] pl-5'>제목</th>
              <th className='py-5 text-right w-[7%] pr-2.5'>작성자</th>
              <th className='py-5 text-right w-[8%] pr-5'>작성일</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b border-grey-10'>
              <td className='py-5 text-left pl-5'>4</td>
              <td className='py-5 text-left pl-5'>
                <Link
                  to='detail'
                  className='hover:text-secondary-20 transition-colors'
                >
                  피그마 너무 어려운데요.
                </Link>
                <span className='inline-block px-5 py-2 rounded-[20px] bg-primary-40 text-white text-sm ml-2.5'>
                  답변완료
                </span>
              </td>
              <td className='py-5 text-right pr-2.5'>홍길동</td>
              <td className='py-5 text-right pr-5'>
                <div>2024-01-01</div>
                <div>00:00:00</div>
              </td>
            </tr>
            <tr className='border-b border-grey-10'>
              <td className='py-5 text-left pl-5'>3</td>
              <td className='py-5 text-left pl-5'>
                <Link
                  to='detail'
                  className='hover:text-secondary-20 transition-colors'
                >
                  피그마 너무 어려운데요.
                </Link>
                <span className='inline-block px-5 py-2 rounded-[20px] bg-grey-20 text-white text-sm ml-2.5'>
                  답변대기
                </span>
              </td>
              <td className='py-5 text-right pr-2.5'>홍길동</td>
              <td className='py-5 text-right pr-5'>
                <div>2024-01-01</div>
                <div>00:00:00</div>
              </td>
            </tr>
            <tr className='border-b border-grey-10'>
              <td className='py-5 text-left pl-5'>2</td>
              <td className='py-5 text-left pl-5'>
                <Link
                  to='detail'
                  className='hover:text-secondary-20 transition-colors'
                >
                  피그마 너무 어려운데요.
                </Link>
                <span className='inline-block px-5 py-2 rounded-[20px] bg-primary-40 text-white text-sm ml-2.5'>
                  답변완료
                </span>
              </td>
              <td className='py-5 text-right pr-2.5'>홍길동</td>
              <td className='py-5 text-right pr-5'>
                <div>2024-01-01</div>
                <div>00:00:00</div>
              </td>
            </tr>
            <tr className='border-b border-grey-10'>
              <td className='py-5 text-left pl-5'>1</td>
              <td className='py-5 text-left pl-5'>
                <Link
                  to='detail'
                  className='hover:text-secondary-20 transition-colors'
                >
                  피그마 너무 어려운데요.
                </Link>
                <span className='inline-block px-5 py-2 rounded-[20px] bg-grey-20 text-white text-sm ml-2.5'>
                  답변대기
                </span>
              </td>
              <td className='py-5 text-right pr-2.5'>홍길동</td>
              <td className='py-5 text-right pr-5'>
                <div>2024-01-01</div>
                <div>00:00:00</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='flex justify-center gap-2 mt-10'>
        <button className='flex justify-center items-center w-10 h-10 rounded-[10px] border-none cursor-pointer bg-secondary-20 text-white hover:bg-secondary-40 transition-colors'>
          1
        </button>
        <button className='flex justify-center items-center w-10 h-10 rounded-[10px] border-none cursor-pointer bg-grey-20 hover:bg-grey-30 transition-colors'>
          2
        </button>
        <button className='flex justify-center items-center w-10 h-10 rounded-[10px] border-none cursor-pointer bg-grey-20 hover:bg-grey-30 transition-colors'>
          3
        </button>
        <button className='flex justify-center items-center w-auto h-10 rounded-[10px] border-none cursor-pointer bg-grey-20 hover:bg-grey-30 transition-colors px-4'>
          Next
        </button>
      </div>
      <div className='pt-10 flex justify-center gap-[5.4px] h-[70.67px]'>
        <div className='relative w-[120px]'>
          <select className='w-full h-[37px] px-2.5 border border-grey-10 rounded bg-white'>
            <option value='title'>제목</option>
            <option value='date'>등록일</option>
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
