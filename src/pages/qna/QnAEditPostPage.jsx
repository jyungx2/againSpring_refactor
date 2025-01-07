import { Link, useNavigate } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

export default function QnAEditPostPage() {
  /**
   *
   * TODO: [API 연동] 게시글 상세 정보 조회
   * 1. URL 파라미터에서 게시글 ID를 추출 (useParams 사용)
   * 2. 해당 ID로 게시글 상세 정보를 조회하는 API 호출
   * 3. 응답 받은 데이터로 제목과 내용의 초기값 설정
   *
   */

  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  // TODO: [상태 관리] 서버에서 받아온 데이터로 초기값 설정
  // 현재는 임시 데이터 사용
  const [title, setTitle] = useState('피그마 너무 어려운데요.');
  const [originalTitle] = useState('피그마 너무 어려운데요.');
  const [originalContent] = useState('감기조심하세요');

  // TODO: [데이터 검증] 제목과 내용이 모두 입력되었는지 확인하는 유효성 검사 추가

  /**
   *
   * TODO: [에러 처리] API 호출 실패 시 에러 처리
   * 1. try-catch 문으로 API 호출 감싸기
   * 2. 에러 발생 시 사용자에게 적절한 메시지 표시
   * 3. 필요한 경우 에러 로깅
   *
   */

  /**
   * TODO: [취소 확인] 실제 서버 데이터와 비교하는 로직으로 수정
   * 1. 현재 화면의 제목/내용과 서버에서 받아온 원본 데이터를 비교
   * 2. 변경사항이 있을 경우에만 확인 모달 표시
   *
   */

  const cancelCheckBtn = () => {
    // 제목이나 내용이 변경되었는지 확인
    const titleChanged = title !== originalTitle;
    // Quill 에디터의 텍스트만 비교
    const currentContent = quill ? quill.getText().trim() : '';
    const originalTextContent = originalContent.replace(/<[^>]*>/g, '').trim();
    const contentChanged = currentContent !== originalTextContent;

    console.log('Title changed:', titleChanged);
    console.log('Content changed:', contentChanged);
    console.log('Current content:', currentContent);
    console.log('Original content:', originalTextContent);

    if (titleChanged || contentChanged) {
      MySwal.fire({
        title: '수정 중인 게시물이 있습니다. 취소하시겠습니까?',
        text: '기존에 작성된 게시글로 복구됩니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네',
        cancelButtonText: '아니요',
      }).then((result) => {
        if (result.isConfirmed) {
          MySwal.fire({
            title: '취소 완료',
            text: '게시글 수정이 취소되었습니다.',
            confirmButtonText: '확인',
            icon: 'success',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/qna/detail');
            }
          });
        }
      });
    } else {
      // 변경된 내용이 없으면 바로 이동
      navigate('/qna/detail');
    }
  };

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
    <div className='w-[1200px] mx-auto px-6 relative min-h-screen pb-52'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        Q&amp;A
      </h1>

      <input
        className='w-full mb-4 box-border border py-2 px-4 rounded-md text-xl h-[50px]'
        type='text'
        defaultValue='피그마 너무 어려운데요.'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className='w-full'>
        <div className='min-h-[400px] h-[60vh] max-h-[800px]'>
          <div ref={quillRef} className='h-full' />
        </div>
      </div>

      <div className='absolute bottom-0 left-0 right-0 flex justify-center gap-[38px] py-10'>
        {/* TODO: [수정 기능] 수정하기 버튼 클릭 시 처리
           1. 제목과 내용의 유효성 검사
           2. API로 수정된 내용 전송
           3. 성공/실패 시 적절한 메시지 표시
           4. 성공 시 상세 페이지로 이동 */}
        <button className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-secondary-20 text-white'>
          <Link to='/qna/detail'>수정하기</Link>
        </button>
        <button
          className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-grey-20'
          onClick={cancelCheckBtn}
        >
          취소하기
        </button>
      </div>
    </div>
  );
}
