import { useParams } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import { QUILL_FORMATS, QUILL_MODULES } from '@constants/editorConfig';
import { useNoticeEditPost } from '@hooks/useNoticeEditPost';
import { handleImageUpload } from '@utils/imageUpload';

export default function NoticeEditPostPage() {
  const { id } = useParams();
  const { quill, quillRef } = useQuill({
    modules: QUILL_MODULES,
    formats: QUILL_FORMATS,
  });

  const {
    title,
    setTitle,
    // content,
    isLoading,
    setQuillInstance,
    handleUpdate,
    handleCancel,
  } = useNoticeEditPost({ _id: id }, null, `/notice/detail/${id}`);

  useEffect(() => {
    if (quill) {
      setQuillInstance(quill);
      quill
        .getModule('toolbar')
        .addHandler('image', () => handleImageUpload(quill));
    }
  }, [quill, setQuillInstance]);
  return (
    <div className='w-[1200px] mx-auto px-6 relative min-h-screen pb-32'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        공지사항
      </h1>

      <input
        className='w-full mb-4 box-border border border-black py-2 px-4 rounded-md text-xl h-[50px]'
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className='w-full'>
        <div className='min-h-[400px] h-[60vh] max-h-[800px]'>
          <div ref={quillRef} className='h-full' />
        </div>
      </div>

      <div className='absolute bottom-0 left-0 right-0 flex justify-center gap-[38px] py-10'>
        <button
          className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-secondary-20 text-white'
          onClick={handleUpdate}
          disabled={isLoading}
        >
          수정하기
        </button>
        <button
          className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-grey-20'
          onClick={handleCancel}
          disabled={isLoading}
        >
          취소하기
        </button>
      </div>
    </div>
  );
}
