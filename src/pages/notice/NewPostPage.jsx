import { Link } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import { useEffect } from 'react';
import { useQuill } from 'react-quilljs';

export default function NewPostPage() {
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

  // 이미지 업로드 처리
  const selectLocalImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    console.log('이미지 업로드 버튼 클릭');

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        console.log('file data 변경 또는 입력' + file);
        /**
         * TODO 여기에 실제 이미지 업로드 로직 구현해야 함
         *
         * 1. 서버 파일 데이터 저장 요청
         * 2. 서버가 저장된 사진 값을 반환 ({{url}}/files/00-sample/Gb4OJkEX2k.jpg)
         * 3. 이걸 가지고 이미지 주소에 넣어주면 됨
         *
         */

        const formData = new FormData();
        formData.append('attach', file);

        const response = await fetch('https://11.fesp.shop/files', {
          method: 'POST',
          body: formData,
          headers: {
            'client-id': 'final02',
            // "Content-Type": "multipart/form-data" // FormData를 사용할 때는 자동으로 설정됨
          },
        });

        console.log(response);

        const result = await response.json();
        console.log('이미지 업로드 성공:', result.item[0].path);

        // 전체 이미지 URL 생성 (도메인 + path)
        const imageUrl = `https://11.fesp.shop${result.item[0].path}`;

        // 현재 커서 위치 가져오기
        const range = quill.getSelection(true);

        // 이미지 삽입
        quill.insertEmbed(range.index, 'image', imageUrl);

        // 커서를 이미지 다음으로 이동 (선택사항)
        quill.setSelection(range.index + 1);
      }
    };
  };

  useEffect(() => {
    if (quill) {
      quill.getModule('toolbar').addHandler('image', selectLocalImage);
    }
  }, [quill]);

  const newPostSaveBtn = () => {
    console.log(quill.root.innerHTML);

    const saveData = async () => {
      const data = {
        type: 'info',
        title: '글쓰기 테스트',
        content: quill.root.innerHTML,
      };

      const response = await fetch('https://11.fesp.shop/posts', {
        method: 'POST',
        body: JSON.stringify(data), // 데이터를 JSON 문자열로 변환
        headers: {
          'client-id': 'final02',
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      console.log('이미지 업로드 성공:', result);
    };

    saveData();
  };

  return (
    <div className='container mx-auto px-6 relative min-h-screen pb-32'>
      <h1 className='h-[63px] text-2xl text-center box-border m-0 px-0 py-[15px]'>
        공지사항
      </h1>

      <input
        className='w-full mb-4 box-border border border-black py-2 px-4 rounded-md text-base'
        type='text'
        placeholder='제목을 입력하세요'
      />

      <div className='w-full'>
        <div className='min-h-[400px] h-[60vh] max-h-[800px]'>
          <div ref={quillRef} className='h-full' />
        </div>
      </div>

      <div className='absolute bottom-0 left-0 right-0 flex justify-center gap-[38px] py-10'>
        <button
          onClick={() => {
            newPostSaveBtn();
          }}
          className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-secondary-20 text-white'
        >
          <Link>등록하기</Link>
        </button>
        <button className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-grey-20'>
          <Link to='/notice'>취소하기</Link>
        </button>
      </div>
    </div>
  );
}
