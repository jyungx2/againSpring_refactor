import './fonts.css';
export default function list() {
  return (
    <div className='relative w-full max-w-[1920px] h-[1460px] box-border mx-auto my-0 px-[100px] py-0'>
      <h1 className='h-[63px] text-2xl text-center box-border m-0 px-0 py-[15px]'>
        공지사항
      </h1>
      <div className='flex justify-end mb-5 w-full'>
        <button className='py-2 px-5 bg-[#835f45] text-white border-none rounded cursor-pointer'>
          <a href='./new_post.html'>글 작성</a>
        </button>
      </div>
      <div className='grid grid-cols-[repeat(4,280px)] justify-center gap-6 w-[calc(4_*_280px_+_3_*_24px)] mx-auto my-0'>
        <div className='w-[280px]'>
          <img
            className='rounded object-cover w-full h-auto'
            src='https://via.placeholder.com/280'
            alt='Notice thumbnail'
          />
          <div className='pt-[19px] pl-[10px] w-full'>
            <h4 className='text-[#fa5252] text-sm m-0'>공지사항</h4>
            <h3 className='text-base my-2 mx-0'>
              <a href='./post_detail.html'>연말 휴무 및 택배 없는 날 안내</a>
            </h3>
            <h4 className='text-[#6b7280] text-sm m-0'>24/12/30</h4>
          </div>
        </div>
        <div className='w-[280px]'>
          <img
            className='rounded object-cover w-full h-auto'
            src='https://via.placeholder.com/280'
            alt='Notice thumbnail'
          />
          <div className='pt-[19px] pl-[10px] w-full'>
            <h4 className='text-[#fa5252] text-sm m-0'>공지사항</h4>
            <h3 className='text-base my-2 mx-0'>
              <a href='./post_detail.html'>연말 휴무 및 택배 없는 날 안내</a>
            </h3>
            <h4 className='text-[#6b7280] text-sm m-0'>24/12/30</h4>
          </div>
        </div>
        <div className='w-[280px]'>
          <img
            className='rounded object-cover w-full h-auto'
            src='https://via.placeholder.com/280'
            alt='Notice thumbnail'
          />
          <div className='pt-[19px] pl-[10px] w-full'>
            <h4 className='text-[#fa5252] text-sm m-0'>공지사항</h4>
            <h3 className='text-base my-2 mx-0'>
              <a href='./post_detail.html'>연말 휴무 및 택배 없는 날 안내</a>
            </h3>
            <h4 className='text-[#6b7280] text-sm m-0'>24/12/30</h4>
          </div>
        </div>
        <div className='w-[280px]'>
          <img
            className='rounded object-cover w-full h-auto'
            src='https://via.placeholder.com/280'
            alt='Notice thumbnail'
          />
          <div className='pt-[19px] pl-[10px] w-full'>
            <h4 className='text-[#fa5252] text-sm m-0'>공지사항</h4>
            <h3 className='text-base my-2 mx-0'>
              <a href='./post_detail.html'>연말 휴무 및 택배 없는 날 안내</a>
            </h3>
            <h4 className='text-[#6b7280] text-sm m-0'>24/12/30</h4>
          </div>
        </div>
      </div>
      <div className='flex justify-center gap-2 mt-10'>
        <button className='flex justify-center items-center w-10 h-10 rounded-[10px] border-none cursor-pointer bg-[#bc9f8b] text-white'>
          1
        </button>
        <button className='flex justify-center items-center w-10 h-10 rounded-[10px] border-none cursor-pointer bg-[#d9d9d9]'>
          2
        </button>
        <button className='flex justify-center items-center w-10 h-10 rounded-[10px] border-none cursor-pointer bg-[#d9d9d9]'>
          3
        </button>
        <button className='flex justify-center items-center w-auto h-10 rounded-[10px] border-none cursor-pointer bg-[#d9d9d9] px-4'>
          Next
        </button>
      </div>
    </div>
  );
}
