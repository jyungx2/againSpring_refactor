import { Link, useNavigate } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import QnAProductModal from '@pages/qna/QnAProductModal';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { QUILL_FORMATS, QUILL_MODULES } from '@constants/editorConfig';
import { handleImageUpload } from '@utils/imageUpload';
import useAxiosInstance from '@hooks/useAxiosInstance';
import { useQueryClient } from '@tanstack/react-query';

export default function QnANewPostPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previousSelection, setPreviousSelection] = useState(null);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');

  const { quill, quillRef } = useQuill({
    modules: QUILL_MODULES,
    formats: QUILL_FORMATS,
  });

  // Modal 열 때 현재 선택 정보 저장
  const openModal = () => {
    setPreviousSelection(selectedProduct);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (selectedProduct !== previousSelection) {
      MySwal.fire({
        title: '선택을 취소하시겠습니까?',
        text: '변경사항이 저장되지 않습니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '네',
        cancelButtonText: '아니오',
      }).then((result) => {
        if (result.isConfirmed) {
          setSelectedProduct(previousSelection);
          resetModalState();
        }
      });
    } else {
      resetModalState();
    }
  };

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
        setSelectedProduct(null);
        MySwal.fire('제거 완료', '선택된 상품이 제거되었습니다.', 'success');
      }
    });
  };

  const handleProductSelect = (product) => {
    try {
      if (!product || !product._id) {
        throw new Error('올바르지 않은 상품 정보입니다.');
      }

      if (selectedProduct?._id !== product._id) {
        setError(null);
        setSelectedProduct(product);
      } else {
        MySwal.fire({
          title: '알림',
          text: '이미 선택된 상품입니다.',
          icon: 'info',
          confirmButtonText: '확인',
        });
      }
    } catch (err) {
      console.error('상품 선택 중 오류 발생: ', err);
      setError(err.message);
    }
  };

  // Quill 에디터 이미지 핸들러 등록
  useEffect(() => {
    if (quill) {
      quill
        .getModule('toolbar')
        .addHandler('image', () => handleImageUpload(quill));
    }
  }, [quill]);

  // 취소 확인 버튼
  const handleCancel = () => {
    const hasContent =
      title.trim() !== '' || (quill && quill.getText().trim() !== '');

    if (hasContent) {
      MySwal.fire({
        title: '작성 중인 게시물이 있습니다. 취소하시겠습니까?',
        text: '게시글은 복구할 수 없습니다.',
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
      navigate('/qna');
    }
  };

  const axios = useAxiosInstance();

  const handleSave = async () => {
    let productId = selectedProduct?._id;

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
      if (result.isConfirmed) {
        saveData();
      }
    });

    const saveData = async () => {
      try {
        const response = await axios.post('/posts', data);

        if (response.data.ok === 1) {
          // Q&A 목록 쿼리 무효화
          await queryClient.invalidateQueries({ queryKey: ['posts', 'qna'] });

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
          text:
            error.response?.data?.message ||
            '게시글 등록에 실패했습니다. 다시 시도해주세요.',
          icon: 'error',
          confirmButtonText: '확인',
        });
      }
    };
  };

  return (
    <div className='w-[1200px] mx-auto px-6 relative min-h-screen pb-52'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        Q&A
      </h1>

      {/* 상품 정보 표시 */}
      <div className='flex items-center mb-4 p-6 border rounded-md w-full'>
        <div className='mr-6 relative'>
          {selectedProduct?.mainImages?.length > 0 ? (
            <>
              <img
                src={`https://11.fesp.shop${selectedProduct.mainImages[0].path}`}
                alt={selectedProduct.name}
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
          <div className='text-lg'>
            상품명:
            {selectedProduct ? selectedProduct.name : '상품을 선택해주세요'}
          </div>
          <div className='flex gap-4'>
            <button
              className='px-6 py-2.5 bg-black text-white text-base rounded hover:bg-gray-800'
              disabled={!selectedProduct}
            >
              <Link
                to={selectedProduct ? `/detail/${selectedProduct._id}` : '#'}
              >
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

      {/* 제목 입력 */}
      <input
        className='w-full mb-4 box-border border py-2 px-4 rounded-md text-xl h-[50px]'
        type='text'
        placeholder='제목을 입력하세요'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Quill 에디터 */}
      <div className='w-full'>
        <div className='min-h-[400px] h-[60vh] max-h-[800px]'>
          <div ref={quillRef} className='h-full' />
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div className='absolute bottom-0 left-0 right-0 flex justify-center gap-[38px] py-10'>
        <button
          onClick={handleSave}
          className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-secondary-20 text-white'
        >
          등록하기
        </button>
        <button
          onClick={handleCancel}
          className='rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-grey-20'
        >
          취소하기
        </button>
      </div>

      {/* 상품 선택 모달 */}
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
