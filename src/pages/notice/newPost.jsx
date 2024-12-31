import './fonts.css';
export default function newPost() {
  return (
    <div className='relative w-full max-w-[1920px] h-[1460px] box-border mx-auto my-0 px-[100px] py-0'>
      <h1 className='h-[63px] text-2xl text-center box-border m-0 px-0 py-[15px]'>
        공지사항
      </h1>
      <input
        className='w-full mb-4 box-border border border-black py-2 px-4 rounded-md text-base'
        type='text'
        placeholder='제목을 입력하세요'
      />
      <div className='w-full mb-4 box-border flex gap-2 p-2'>
        <button
          className='py-2 px-3 border-none bg-inherit cursor-pointer hover:bg-gray-300'
          title='굵게'
        >
          <img src='./images/notice/bold.png' />
        </button>
        <button
          className='py-2 px-3 border-none bg-inherit cursor-pointer hover:bg-gray-300'
          title='기울임'
        >
          <img src='./images/notice/italic.png' />
        </button>
        <button
          className='py-2 px-3 border-none bg-inherit cursor-pointer hover:bg-gray-300'
          title='밑줄'
        >
          <img src='./images/notice/underlined.png' />
        </button>
        <button
          className='py-2 px-3 border-none bg-inherit cursor-pointer hover:bg-gray-300'
          title='왼쪽 정렬'
        >
          <img src='./images/notice/alignLeft.png' />
        </button>
        <button
          className='py-2 px-3 border-none bg-inherit cursor-pointer hover:bg-gray-300'
          title='가운데 정렬'
        >
          <img src='./images/notice/alignCenter.png' />
        </button>
        <button
          className='py-2 px-3 border-none bg-inherit cursor-pointer hover:bg-gray-300'
          title='오른쪽 정렬'
        >
          <img src='./images/notice/alignRight.png' />
        </button>
        <button
          className='py-2 px-3 border-none bg-inherit cursor-pointer hover:bg-gray-300'
          title='링크'
        >
          🔗
        </button>
        <button
          className='py-2 px-3 border-none bg-inherit cursor-pointer hover:bg-gray-300'
          title='목록'
        >
          <img src='./images/notice/list.png' />
        </button>
      </div>
      <textarea
        className='w-full h-[800px] p-4 text-base mb-4 box-border resize-none rounded-md border border-black'
        placeholder='내용을 입력하세요'
        defaultValue={''}
      />
      <div className='w-full mb-4 box-border'>
        <div className='border border-dashed border-black p-[30px] text-center'>
          <div className='flex justify-center'>
            <img
              src='./images/notice/camera.png'
              alt='파일 업로드'
              width='40px'
            />
          </div>
          <p>파일을 이 곳에 드래그하거나 클릭하여 업로드하세요.</p>
          <input type='file' className='hidden' />
          <button
            type='button'
            className='mt-[10px] py-2 px-4 bg-inherit border border-gray-300 rounded cursor-pointer'
          >
            파일 선택
          </button>
        </div>
      </div>
      <div className='flex justify-center gap-[38px] mt-10'>
        <button className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-[#bc9f8b] text-white'>
          <a href='./post_detail.html'>등록하기</a>
        </button>
        <button className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-[#d9d9d9]'>
          <a href='./list.html'>취소하기</a>
        </button>
      </div>
    </div>
  );
}
