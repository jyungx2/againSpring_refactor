import { Link } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import { useEffect } from 'react';
import { useQuill } from 'react-quilljs';

/**
 * 새로운 게시글을 작성하기 위한 페이지 컴포넌트
 * React-Quill 에디터를 사용하여 리치 텍스트 편집 기능을 제공
 * 이미지 업로드, 텍스트 스타일링, 게시글 저장 기능 포함
 */
export default function NewPostPage() {
  // Quill 에디터 설정
  const modules = {
    // 툴바 설정: 텍스트 스타일링, 정렬, 리스트, 링크, 이미지 기능 포함
    toolbar: [
      ['bold', 'italic', 'underline'], // 텍스트 스타일 옵션
      [{ align: ['', 'center', 'right'] }], // 텍스트 정렬 옵션
      [{ list: 'ordered' }, { list: 'bullet' }], // 리스트 옵션
      ['link'], // 링크 삽입 옵션
      // ['image'], // 이미지 삽입 옵션 비활성화
    ],
    clipboard: {
      matchVisual: false, // 복사/붙여넣기 시 시각적 포맷팅 매칭 비활성화
    },
  };

  // Quill 에디터에서 사용할 수 있는 포맷 정의
  const formats = [
    'bold',
    'italic',
    'underline',
    'align',
    'list',
    'link',
    // 'image', // 이미지 포맷 비활성화
    'ordered',
    'bullet',
  ];

  // Quill 에디터 초기화
  const { quill, quillRef } = useQuill({
    modules,
    formats,
    placeholder: '내용을 입력하세요',
    theme: 'snow', // 스노우 테마 사용
  });

  /**
   * 로컬 이미지 선택 및 업로드 처리 함수
   * 1. 파일 선택 다이얼로그 생성
   * 2. 선택된 이미지 파일을 서버에 업로드
   * 3. 업로드된 이미지 URL을 에디터에 삽입
   */
  const selectLocalImage = () => {
    // 파일 입력 엘리먼트 생성
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    console.log('이미지 업로드 버튼 클릭');

    // 파일 선택 시 이벤트 처리
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

        // FormData 객체 생성 및 파일 추가
        const formData = new FormData();
        formData.append('attach', file);

        // 서버에 이미지 업로드 요청
        const response = await fetch('https://11.fesp.shop/files', {
          method: 'POST',
          body: formData,
          headers: {
            'client-id': 'final02',
          },
        });

        console.log(response);

        // 업로드 결과 처리
        const result = await response.json();
        console.log('이미지 업로드 성공:', result.item[0].path);

        // 전체 이미지 URL 생성
        const imageUrl = `https://11.fesp.shop${result.item[0].path}`;

        // 현재 커서 위치 가져오기
        const range = quill.getSelection(true);

        // 에디터에 이미지 삽입
        quill.insertEmbed(range.index, 'image', imageUrl);

        // 커서를 이미지 다음으로 이동
        quill.setSelection(range.index + 1);
      }
    };
  };

  // Quill 에디터 이미지 핸들러 등록
  useEffect(() => {
    if (quill) {
      quill.getModule('toolbar').addHandler('image', selectLocalImage);
    }
  }, [quill]);

  /**
   * 게시글 저장 처리 함수(임시 비활성화)
   * 에디터의 내용을 서버에 POST 요청으로 전송
   */
  // const newPostSaveBtn = () => {
  //   console.log(quill.root.innerHTML);

  //   const saveData = async () => {
  //     // 저장할 게시글 데이터 구성
  //     const data = {
  //       type: 'info',
  //       title: '글쓰기 테스트',
  //       content: quill.root.innerHTML,
  //     };

  //     // 서버에 게시글 저장 요청
  //     const response = await fetch('https://11.fesp.shop/posts', {
  //       method: 'POST',
  //       body: JSON.stringify(data),
  //       headers: {
  //         'client-id': 'final02',
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     const result = await response.json();
  //     console.log('이미지 업로드 성공:', result);
  //   };

  //   saveData();
  // };

  return (
    // 게시글 작성 페이지 레이아웃
    <div className='w-[1200px] mx-auto px-6 relative min-h-screen pb-32'>
      {/* 페이지 제목 */}
      <h1 className='h-[63px] text-2xl text-center box-border m-0 px-0 py-[15px]'>
        공지사항
      </h1>

      {/* 게시글 제목 입력 필드 */}
      <input
        className='w-full mb-4 box-border border border-black py-2 px-4 rounded-md text-base'
        type='text'
        placeholder='제목을 입력하세요'
      />

      {/* Quill 에디터 컨테이너 */}
      <div className='w-full'>
        <div className='min-h-[400px] h-[60vh] max-h-[800px]'>
          <div ref={quillRef} className='h-full' />
        </div>
      </div>

      {/* 하단 버튼 그룹 */}
      <div className='absolute bottom-0 left-0 right-0 flex justify-center gap-[38px] py-10'>
        {/* 등록 버튼 */}
        <button className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-secondary-20 text-white'>
          <Link to='/notice'>등록하기</Link>
        </button>
        {/* 취소 버튼 */}
        <button className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-grey-20'>
          <Link to='/notice'>취소하기</Link>
        </button>
      </div>
    </div>
  );
}
