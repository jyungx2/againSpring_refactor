import { Link } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
export default function EditPostPage() {
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ align: ['', 'center', 'right'] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['image'],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'bold',
    'italic',
    'underline',
    'align',
    'list',
    'link',
    'image',
    'ordered',
    'bullet',
  ];

  const { quill, quillRef } = useQuill({
    modules,
    formats,
    placeholder: '내용을 입력하세요',
    theme: 'snow',
  });

  // 초기값 설정
  useEffect(() => {
    if (quill) {
      quill.root.innerHTML = '감기조심하세요';
    }
  }, [quill]);

  // 이미지 업로드 처리
  const selectLocalImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        // 여기에 실제 이미지 업로드 로직 구현해야 함
        // 예시로 파일 리더를 사용해 이미지를 base64로 변환
        const render = new FileReader();
        render.onload = () => {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', render.result);
        };
        render.readAsDataURL(file);
      }
    };
  };
  useEffect(() => {
    if (quill) {
      quill.getModule('toolbar').addHandler('image', selectLocalImage);
    }
  }, [quill]);
  return (
    <div className='container mx-auto px-6 relative min-h-screen pb-32'>
      <h1 className='h-[63px] text-2xl text-center box-border m-0 px-0 py-[15px]'>
        Q&amp;A
      </h1>

      <input
        className='w-full mb-4 box-border border border-black py-2 px-4 rounded-md text-base'
        type='text'
        defaultValue='피그마 너무 어려운데요.'
      />

      <div className='w-full'>
        <div className='min-h-[400px] h-[60vh] max-h-[800px]'>
          <div ref={quillRef} className='h-full' />
        </div>
      </div>

      <div className='absolute bottom-0 left-0 right-0 flex justify-center gap-[38px] py-10'>
        <button className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-secondary-20 text-white'>
          <Link to='/qna/detail'>수정하기</Link>
        </button>
        <button className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-grey-20'>
          <Link to='/qna'>취소하기</Link>
        </button>
      </div>
    </div>
  );
}
