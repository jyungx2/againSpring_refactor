import { useState } from 'react';
import postAlerts from '@utils/postAlerts';

export function useProductModal({ selectedProduct, setSelectedProduct }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previousSelection, setPreviousSelection] = useState(null);
  const [error, setError] = useState(null);

  const resetModalState = () => {
    setIsModalOpen(false);
    setPreviousSelection(null);
    setError(null);
  };

  const openModal = () => {
    setPreviousSelection(selectedProduct);
    setIsModalOpen(true);
  };

  const closeModal = async () => {
    if (selectedProduct !== previousSelection) {
      if (await postAlerts.confirmModalClose()) {
        setSelectedProduct(previousSelection);
        resetModalState();
      }
    } else {
      resetModalState();
    }
  };

  const handleProductSelect = async (product) => {
    try {
      if (!product || !product._id) {
        throw new Error('올바르지 않은 상품 정보입니다.');
      }

      if (selectedProduct?._id !== product._id) {
        setError(null);
        setSelectedProduct(product);
        closeModal();
      } else {
        setError('이미 선택된 상품입니다.');
      }
    } catch (err) {
      console.error('상품 선택 중 오류 발생: ', err);
      setError(err.message);
    }
  };

  const handleProductRemove = async () => {
    if (await postAlerts.confirmProductRemove()) {
      setSelectedProduct(null);
    }
  };

  return {
    isModalOpen,
    error,
    openModal,
    closeModal,
    handleProductSelect,
    handleProductRemove,
  };
}

export default useProductModal;
