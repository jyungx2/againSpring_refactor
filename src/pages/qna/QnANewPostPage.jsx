import { Link, useNavigate } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import QnAProductModal from '@pages/qna/QnAProductModal';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import useUserStore from '@store/userStore';

/**
 * 새로운 게시글을 작성하기 위한 페이지 컴포넌트
 * React-Quill 에디터를 사용하여 리치 텍스트 편집 기능을 제공
 * 이미지 업로드, 텍스트 스타일링, 게시글 저장 기능 포함
 */
export default function QnANewPostPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previousSelection, setPreviousSelection] = useState(null); // 이전 선택 정보 저장용
  const [error, setError] = useState(null);
  const [selectedProductInfo, setSelectedProductInfo] = useState(null);
  const { user } = useUserStore();
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');

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
    setIsModalOpen(false);
  };

  const handleProductRemove = () => {
    MySwal.fire({
      title: '선택된 상품을 제거하시겠습니까?',
      text: '제거된 상품 정보는 복구할 수 없습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '네',
      cancelButtonText: '아니오',
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedProductInfo(null); // 선택된 상품 정보 초기화
        MySwal.fire('제거 완료', '선택된 상품이 제거되었습니다.', 'success');
      }
    });
  };

  // 상품 선택 처리 함수
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

    // 파일 선택 시 이벤트 처리
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
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

        // 업로드 결과 처리
        const result = await response.json();

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
   * 에디터의 내용을 서버에 POST 요청으로 전송
   */
  const newPostSaveBtn = () => {
    let productId;

    // 제품 등록이 되어있는지 체크
    if (selectedProductInfo) {
      productId = selectedProductInfo?._id;
    }

    const data = {
      type: 'qna',
      title: title,
      content: quill.root.innerHTML,
    };

    if (productId) data.product_id = productId;

    MySwal.fire({
      title: '게시물을 등록하시겠습니까?',
      text: '잘못 등록한 경우 상세페이지에서 수정 및 삭제가 가능합니다.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '네',
      cancelButtonText: '아니요',
    }).then((result) => {
      // '네'를 선택했을 때만 서버에 저장
      if (result.isConfirmed) {
        saveData();
      }
    });

    const saveData = async () => {
      // 서버에 게시글 저장 요청
      try {
        const response = await fetch('https://11.fesp.shop/posts', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'client-id': 'final02',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        const result = await response.json();
        if (result.ok === 1) {
          MySwal.fire({
            title: '등록 완료',
            text: '게시글 등록이 완료되었습니다.',
            confirmButtonText: '확인',
            icon: 'success',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/qna');
            }
          });
        }
      } catch (error) {
        console.error('게시글 저장 중 오류 발생:', error);
        MySwal.fire({
          title: '등록 실패',
          text: '게시글 등록에 실패했습니다. 다시 시도해주세요.',
          icon: 'error',
          confirmButtonText: '확인',
        });
      }
    };
  };

  return (
    // 게시글 작성 페이지 레이아웃
    <div className='w-[1200px] mx-auto px-6 relative min-h-screen pb-52'>
      {/* 페이지 제목 */}
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        Q&A
      </h1>

      {/* 상품 정보 불러오기 */}
      {selectedProductInfo ? (
        <div className='flex items-center mb-4 p-6 border rounded-md w-full'>
          <div className='mr-6 relative'>
            {selectedProductInfo.mainImages?.length > 0 ? (
              <>
                <img
                  src={`https://11.fesp.shop${selectedProductInfo.mainImages[0].path}`}
                  className='w-32 h-32 bg-gray-200 flex items-center justify-center text-sm text-gray-600'
                />
                <button
                  onClick={handleProductRemove}
                  className='absolute -top-3 -right-3 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center hover:bg-grey-70 transition-colors'
                >
                  x
                </button>
              </>
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
        <button
          onClick={newPostSaveBtn}
          className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-secondary-20 text-white'
        >
          등록하기
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
