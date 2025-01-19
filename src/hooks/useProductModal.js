import { useState } from 'react';
import postAlerts from '@utils/postAlerts';

/**
 * 상품 선택 모달 상태 관리 훅
 * @param {Object} selectedProduct - 현재 선택된 상품
 * @param {Function} setSelectedProduct - 선택된 상품 설정 함수
 */
export function useProductModal({ selectedProduct, setSelectedProduct }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previousSelection, setPreviousSelection] = useState(null);
  const [error, setError] = useState(null);

  /**
   * 모달 상태 초기화 함수
   * 모달을 닫고 모든 상태를 리셋
   */
  const resetModalState = () => {
    setIsModalOpen(false);
    setPreviousSelection(null);
    setError(null);
  };

  /**
   * 모달 열기 함수
   * 현재 선택된 상품을 이전 선택으로 저장
   */
  const openModal = () => {
    setPreviousSelection(selectedProduct);
    setIsModalOpen(true);
  };

  /**
   * 모달 닫기 함수
   * 선택 사항이 변경된 경우 사용자 확인 후 처리
   */
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

  /**
   * 상품 선택 처리 함수
   * @param {Object} product - 선택된 상품 정보
   * @throws {Error} 유효하지 않은 상품 정보
   */
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
