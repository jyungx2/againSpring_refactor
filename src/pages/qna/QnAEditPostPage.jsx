import { Link, useParams } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import { QUILL_FORMATS, QUILL_MODULES } from '@constants/editorConfig';
import { useQnAEditPost } from '@hooks/useQnAEditPost';
import { handleImageUpload } from '@utils/imageUpload';
import QnAProductModal from '@pages/qna/QnAProductModal';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

export default function QnAEditPostPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { id } = useParams();
  const MySwal = withReactContent(Swal);

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
    selectedProduct,
    setSelectedProduct,
    isProductPost,
  } = useQnAEditPost({ _id: id }, null, `/qna/detail/${id}`);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
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

  useEffect(() => {
    if (quill) {
      setQuillInstance(quill);
      quill
        .getModule('toolbar')
        .addHandler('image', () => handleImageUpload(quill));
    }
  }, [quill, setQuillInstance]);

  return (
    <div className='w-[1200px] mx-auto px-6 relative min-h-screen pb-52'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        Q&A
      </h1>

      {isProductPost &&
        (selectedProduct ? (
          <div className='flex items-center mb-4 p-6 border rounded-md w-full'>
            <div className='mr-6 relative'>
              {selectedProduct.mainImages?.length > 0 ? (
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
                상품명: {selectedProduct.name}
                {selectedProduct.price &&
                  ` ${selectedProduct.price.toLocaleString()}원`}
              </div>
              <div className='flex gap-4'>
                <button className='px-6 py-2.5 bg-black text-white text-base rounded hover:bg-gray-800'>
                  <Link to={`/detail/${selectedProduct._id}`}>
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
              <div className='text-lg text-gray-400'>상품을 선택해주세요</div>
              <div className='flex gap-4'>
                <button
                  className='px-6 py-2.5 bg-black text-white text-base rounded hover:bg-gray-800'
                  disabled
                >
                  상품상세보기
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
        ))}

      <input
        className='w-full mb-4 box-border border py-2 px-4 rounded-md text-xl h-[50px]'
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

      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4'>
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
