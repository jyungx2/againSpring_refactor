import { Link, useParams } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import QnAProductModal from '@pages/qna/QnAProductModal';
import { QUILL_FORMATS, QUILL_MODULES } from '@constants/editorConfig';
import { useQnAEditPost } from '@hooks/useQnAEditPost';
import { handleImageUpload } from '@utils/imageUpload';

export default function ProductQnAEditPostPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { id } = useParams();
  const { quill, quillRef } = useQuill({
    modules: QUILL_MODULES,
    formats: QUILL_FORMATS,
  });

  const {
    title,
    setTitle,
    content,
    isLoading,
    setQuillInstance,
    handleUpdate,
    handleCancel,
    selectedProduct,
    setSelectedProduct,
  } = useQnAEditPost(
    { _id: id },
    null, // initialData는 API에서 받아와야 함
    `/qna/product/detail/${id}`
  );

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
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

      {/* 상품 정보 불러오기 */}
      {selectedProduct ? (
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
                  onClick={() => setSelectedProduct(null)}
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
              상품명: {selectedProduct ? selectedProduct.name : ''}
              {selectedProduct.price?.toLocaleString()}원
            </div>
            <div className='flex gap-4'>
              <button className='px-6 py-2.5 bg-black text-white text-base rounded hover:bg-gray-800'>
                <Link to={`/detail/${selectedProduct?._id}`}>상품상세보기</Link>
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
      )}

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

      {/* Modal */}
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
