import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import QnAProductModal from '@pages/qna/QnAProductModal';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

/**
 * TODO: 선택된 상품 정보 표시 구현
 *
 * 1. 상품 정보 상태 관리 (완료)
 *  - selectedProduct 상태 추가
 *  - 상태 초기값은 null로 설정
 *
 * 2. QnAProductModal에 onProductSelect prop 전달(완료)
 *  - Modal 컴포넌트에 onProductSelect 함수 전달
 *  - 선택된 상품 정보를 상태에 저장하는 로직 구현
 *
 * 3. 선택된 상품 정보 표시 UI 구현 (완료)
 *  - 상품 이미지 표시
 *    - mainImages가 있을 경우 첫 번째 이미지 표시
 *    - 없을 경우 NoImage 표시 (현재 UI 활용)
 *  - 상품명 표시
 *    - 현재 "상품명: " 부분에 선택된 상품명 표시
 *  - 상품 상세보기 링크 업데이트
 *    - Link 컴포넌트의 to prop을 선택된 상품의 ID를 사용하도록 수정
 *
 * 4. 상품 선택 상태에 따른 UI 처리 (완료)
 *  - 상품이 선택되지 않은 경우 기본 UI 표시
 *  - 상품이 선택된 경우 해당 상품 정보 표시
 *  - 조건부 렌더링을 통해 처리
 *
 * 5. 상품 정보 초기화 처리
 *  - 새로운 상품 선택 시 이전 선택 정보 초기화
 *  - Modal 닫을 때 불필요한 경우 선택 정보 유지
 */

/**
 * TODO: 상품 정보 초기화 처리 구현
 *
 * 1. Modal 관련 상태 및 핸들러 정리 (완료)
 *  - isModalOpen 상태 확인
 *  - openModal, closeModal 핸들러 확인
 *  - selectedProductInfo 상태 확인
 *
 * 2. 상품 선택 처리 개선 (완료)
 *  - handleProductSelect 함수 내에서
 *    - 이전 선택 정보 확인
 *    - 새로운 상품 정보로 업데이트
 *    - 필요한 경우 관련 UI 상태 초기화
 *
 * 3. Modal 닫기 처리 개선 (완료)
 *  - closeModal 함수 내에서
 *    - 선택 완료된 경우: 현재 선택 정보 유지
 *    - 선택 취소된 경우: 이전 선택 정보 유지
 *    - Modal 내부 상태 초기화 (검색어, 페이지 등)
 *
 * 4. 상품 재선택 시나리오 처리
 *  - 이미 선택된 상품이 있는 상태에서 Modal 열기
 *  - Modal 내에서 이전 선택 상품 표시
 *  - 새로운 선택 시 이전 정보 교체
 *
 * 5. 엣지 케이스 처리
 *  - Modal이 취소로 닫힐 때 처리
 *  - 선택 없이 Modal이 닫힐 때 처리
 *  - 네트워크 오류 발생 시 처리
 *  - 잘못된 상품 데이터 처리
 *
 * 6. 상태 동기화 확인
 *  - selectedProductInfo 상태와 UI 동기화
 *  - Modal 상태와 메인 화면 상태 동기화
 *  - 새로고침 시 상태 초기화 처리
 */

/**
 * TODO: 선택된 상품 데이터 구조
 *
 * selectedProduct: {
 *   _id: string,
 *   name: string,
 *   price: number,
 *   mainImages: Array<{path: string}>,
 *   // ... 기타 필요한 상품 정보
 * } | null
 */

/**
 * 새로운 게시글을 작성하기 위한 페이지 컴포넌트
 * React-Quill 에디터를 사용하여 리치 텍스트 편집 기능을 제공
 * 이미지 업로드, 텍스트 스타일링, 게시글 저장 기능 포함
 */
export default function QnANewPostPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchkeyword, setSearchKeyword] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [previousSelection, setPreviousSelection] = useState(null); // 이전 선택 정보 저장용
  const [searchParams, setSearchParams] = useSearchParams();

  // Modal 열 때 현재 선택 정보 저장
  const openModal = () => {
    setPreviousSelection(selectedProductInfo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // 선택 취소 시 확인 (선택된 상품이 변경되었을 때만)
    if (selectedProductInfo !== previousSelection) {
      MySwal.fire({
        title: '선택을 취소하시겠습니까?',
        text: '변경사항이 저장되지 않습니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '네',
        cancelButtonText: '아니오',
      }).then((result) => {
        if (result.isConfirmed) {
          // 취소 확인 시 이전 선택으로 복원
          setSelectedProductInfo(previousSelection);
          resetModalState();
        }
      });
    } else {
      // 변경 사항이 없으면 바로 닫기
      resetModalState();
    }
  };

  // Modal 상태 초기화 함수
  const resetModalState = () => {
    setSearchKeyword('');
    setPageSize(5);
    setSearchParams({}); // URL 파라미터 초기화
    setIsModalOpen(false);
  };

  const [error, setError] = useState(null);

  const [selectedProductInfo, setSelectedProductInfo] = useState(null);

  // TODO: 페이지네이션 관련 상태 및 핸들러 추가
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page) => {
    // 페이지 변경 로직
  };

  // 상품 선택 처리 함수
  // const handleProductSelect = (product) => {
  //   // 1. 이전 선택 정보와 새로운 선택이 다른지 확인
  //   if (selectedProductInfo?._id !== product._id) {
  //     // 2. 새로운 상품 정보로 업데이트하기 전에 필요한 처리
  //     // 예 : 이전 상품 관련 임시 데이터나 UI 상태 초기화

  //     // 3. 새로운 상품 정보 저장
  //     setSelectedProductInfo(product);

  //     // 4. 선택 완료 후 필요한 처리
  //     // 예 : 성공 메시지 표시나 UI 업데이트
  //     console.log(`상품이 선택되었습니다: ${product.name}`);
  //   } else {
  //     // 5. 같은 상품을 다시 선택한 경우
  //     console.log('이미 선택된 상품입니다.');
  //   }
  // };

  const handleProductSelect = (product) => {
    try {
      // 유효성 검사
      if (!product || !product._id) {
        throw new Error('올바르지 않은 상품 정보입니다.');
      }

      // 이전 선택과 비교
      if (selectedProductInfo?._id !== product._id) {
        // UI 상태 초기화 (에 : 에러 메시지나 임시 데이터)
        setError(null);

        // 새 상품 정보 저장
        setSelectedProductInfo(product);
      } else {
        // 이미 선택된 상품 처리
        MySwal.fire({
          title: '알림',
          text: '이미 선택된 상품입니다.',
          icon: 'info',
          confirmButtonText: '확인',
        });
      }
    } catch (err) {
      // 에러 처리
      console.error('상품 선택 중 오류 발생: ', err);
      setError(err.message);
    }
  };

  // 게시글 작성 중 취소 버튼 눌렀을 떄
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');

  // 취소 확인 버튼
  const cancelCheckBtn = () => {
    // 제목, 내용이 있는지 확인
    const hasContent =
      title.trim() !== '' || (quill && quill.getText().trim() !== '');

    if (hasContent) {
      MySwal.fire({
        title: '작성 중인 게시물이 있습니다. 취소하시겠습니까?',
        text: ' 게시글은 복구할 수 없습니다.',
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
            text: '게시글 작성이 취소되었습니다.',
            confirmButtonText: '확인',
            icon: 'success',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/qna');
            }
          });
        }
      });
    } else {
      // 작성된 내용이 없으면 바로 이동
      navigate('/qna');
    }
  };

  // Quill 에디터 설정
  const modules = {
    // 툴바 설정: 텍스트 스타일링, 정렬, 리스트, 링크, 이미지 기능 포함
    toolbar: [
      ['bold', 'italic', 'underline'], // 텍스트 스타일 옵션
      [{ align: ['', 'center', 'right'] }], // 텍스트 정렬 옵션
      [{ list: 'ordered' }, { list: 'bullet' }], // 리스트 옵션
      ['link'], // 링크 삽입 옵션
      ['image'],
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
    'image',
    // 'ordered', // 오류 나서 주석 처리
    // 'bullet', // 오류 나서 주석 처리
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
         * TODO: 여기에 실제 이미지 업로드 로직 구현해야 함
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
  //       type: 'qna',
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
    <div className='w-[1200px] mx-auto px-6 relative min-h-screen pb-52'>
      {/* 페이지 제목 */}
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        Q&amp;A
      </h1>

      {/* 상품 정보 불러오기 */}

      {/**
       * TODO: 선택된 상품 정보 표시 UI 구현
       *
       * 1. 조건부 렌더링 구조 만들기(완료)
       * - selectedProductInfo 유무에 따라 다른 UI 표시
       * - selectedProductInfo가 null일 떄는 기본 UI
       * - selectedProductInfo가 잇을 때는 상품 정보 표시
       *
       * 2. 이미지 표시 구현 (완료)
       * - mainImages 배열 체크
       * - 이미지가 있을 경우
       *  - https://11.fesp.shop + mainImages[0].path
       *  - alt 속성에는 상품명
       * -이미지가 없을 경우 "No Image" 표시
       *
       * 3. 상품 정보 표시(완료)
       * - 상품명: selectedProductInfo.name
       * - Link 컴포넌트 to 속성: `/detail/${selectedProductInfo._id}`
       *
       * 4. 테스트(완료)
       * - 상품 선택 전 기본 UI 확인
       * - 상품 선택 후 정보 표시 확인
       * - 이미지 로드 확인
       * - 상품 상세보기 링크 작동 확인
       */}

      {selectedProductInfo ? (
        <div className='flex items-center mb-4 p-6 border rounded-md w-full'>
          <div className='mr-6'>
            {selectedProductInfo.mainImages?.length > 0 ? (
              <img
                src={`https://11.fesp.shop${selectedProductInfo.mainImages[0].path}`}
                className='w-32 h-32 bg-gray-200 flex items-center justify-center text-sm text-gray-600'
              />
            ) : (
              <div className='w-32 h-32 bg-gray-200 flex items-center justify-center text-sm text-gray-600'>
                No Image
              </div>
            )}
          </div>
          <div className='flex flex-col gap-4 justify-center h-32'>
            <div className='text-lg'>상품명: {selectedProductInfo.name} </div>
            <div className='flex gap-4'>
              <button className='px-6 py-2.5 bg-black text-white text-base rounded hover:bg-gray-800'>
                <Link to={`/detail/${selectedProductInfo._id}`}>
                  상품상세보기
                </Link>
              </button>
              <button
                className='px-6 py-2.5 border border-black text-base rounded hover:bg-gray-50'
                onClick={openModal}
              >
                상품정보선택
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex items-center mb-4 p-6 border rounded-md w-full'>
          <div className='mr-6'>
            <div className='w-32 h-32 bg-gray-200 flex items-center justify-center text-sm text-gray-600'>
              No Image
            </div>
          </div>
          <div className='flex flex-col gap-4 justify-center h-32'>
            <div className='text-lg'>상품명: </div>
            <div className='flex gap-4'>
              <button className='px-6 py-2.5 bg-black text-white text-base rounded hover:bg-gray-800'>
                <Link to='/detail'>상품상세보기</Link>
              </button>
              <button
                className='px-6 py-2.5 border border-black text-base rounded hover:bg-gray-50'
                onClick={openModal}
              >
                상품정보선택
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 게시글 제목 입력 필드 */}
      <input
        className='w-full mb-4 box-border border py-2 px-4 rounded-md text-xl h-[50px]'
        type='text'
        placeholder='제목을 입력하세요'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
          <Link to='/qna'>등록하기</Link>
        </button>
        {/* 취소 버튼 */}
        <button
          className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-grey-20'
          onClick={cancelCheckBtn}
        >
          취소하기
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[calc(100vh-2rem)] overflow-hidden'>
            <QnAProductModal
              onClose={closeModal}
              onProductSelect={handleProductSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}
