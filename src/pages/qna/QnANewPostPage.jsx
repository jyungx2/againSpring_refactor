import { Link, useNavigate } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import QnAProductModal from '@pages/qna/QnAProductModal';
import { QUILL_FORMATS, QUILL_MODULES } from '@constants/editorConfig';
import { handleImageUpload } from '@utils/imageUpload';
import useAxiosInstance from '@hooks/useAxiosInstance';
import { useQueryClient } from '@tanstack/react-query';
import QnAAlerts from '@utils/qnaAlerts';

export default function QnANewPostPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axios = useAxiosInstance();

  const [title, setTitle] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previousSelection, setPreviousSelection] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { quill, quillRef } = useQuill({
    modules: QUILL_MODULES,
    formats: QUILL_FORMATS,
  });

  useEffect(() => {
    if (quill) {
      quill
        .getModule('toolbar')
        .addHandler('image', () => handleImageUpload(quill));
    }
  }, [quill]);

  const openModal = () => {
    setPreviousSelection(selectedProduct);
    setIsModalOpen(true);
  };

  const closeModal = async () => {
    if (selectedProduct !== previousSelection) {
      if (await QnAAlerts.confirmModalClose()) {
        setSelectedProduct(previousSelection);
        resetModalState();
      }
    } else {
      resetModalState();
    }
  };

  const resetModalState = () => {
    setIsModalOpen(false);
  };

  const handleProductSelect = async (product) => {
    try {
      if (!product || !product._id) {
        throw new Error('올바르지 않은 상품 정보입니다.');
      }

      if (selectedProduct?._id !== product._id) {
        setError(null);
        setSelectedProduct(product);
        await QnAAlerts.confirmProductSelect(product.name);
        closeModal();
      } else {
        await QnAAlerts.showDuplicateProductWarning();
      }
    } catch (err) {
      console.error('상품 선택 중 오류 발생: ', err);
      setError(err.message);
    }
  };

  const handleProductRemove = async () => {
    if (await QnAAlerts.confirmProductRemove()) {
      setSelectedProduct(null);
    }
  };

  const handleCancel = async () => {
    const hasContent =
      title.trim() !== '' || (quill && quill.getText().trim() !== '');

    if (hasContent) {
      if (await QnAAlerts.confirmCancel()) {
        navigate('/qna');
      }
    } else {
      navigate('/qna');
    }
  };

  const handleSave = async () => {
    const data = {
      type: 'qna',
      title: title,
      content: quill.root.innerHTML,
      ...(selectedProduct?._id && { product_id: selectedProduct._id }),
    };

    if (await QnAAlerts.confirmSave()) {
      try {
        const response = await axios.post('/posts', data);
        if (response.data.ok === 1) {
          await queryClient.invalidateQueries({ queryKey: ['posts', 'qna'] });
          if (await QnAAlerts.showSaveSuccess()) {
            navigate('/qna');
          }
        }
      } catch (error) {
        await QnAAlerts.showSaveError(error);
      }
    }
  };

  return (
    <div className='w-[1200px] mx-auto px-6 relative min-h-screen pb-52'>
      <h1 className='h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]'>
        Q&A
      </h1>

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

      <input
        className='w-full mb-4 box-border border py-2 px-4 rounded-md text-xl h-[50px]'
        type='text'
        placeholder='제목을 입력하세요'
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
