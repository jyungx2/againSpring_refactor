import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const postAlerts = {
  confirmCancel: async (isEdit = false, postType = '') => {
    const result = await MySwal.fire({
      title: `${
        isEdit ? '수정' : '작성'
      } 중인 ${postType} 게시물이 있습니다. 취소하시겠습니까?`,
      text: '게시글은 복구할 수 없습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '네',
      cancelButtonText: '아니요',
    });

    if (result.isConfirmed) {
      const confirmResult = await MySwal.fire({
        title: '취소 완료',
        text: `${postType} 게시글 ${
          isEdit ? '수정이' : '작성이'
        } 취소되었습니다.`,
        confirmButtonText: '확인',
        icon: 'success',
      });
      return confirmResult.isConfirmed;
    }

    return false;
  },

  confirmSave: async (isEdit = false, postType = '') => {
    const result = await MySwal.fire({
      title: `${postType} 게시물을 ${isEdit ? '수정' : '등록'}하시겠습니까?`,
      text: isEdit
        ? '잘못 수정한 경우 상세페이지에서 재수정 가능합니다.'
        : '잘못 등록한 경우 상세페이지에서 수정 및 삭제가 가능합니다.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '네',
      cancelButtonText: '아니요',
    });
    return result.isConfirmed;
  },

  showSaveSuccess: async (isEdit = false, postType = '') => {
    const result = await MySwal.fire({
      title: `${postType} ${isEdit ? '수정' : '등록'} 완료`,
      text: `${postType} 게시글 ${
        isEdit ? '수정이' : '등록이'
      } 완료되었습니다.`,
      confirmButtonText: '확인',
      icon: 'success',
    });
    return result.isConfirmed;
  },

  showSaveError: async (error, isEdit = false, postType = '') => {
    await MySwal.fire({
      title: `${postType} ${isEdit ? '수정' : '등록'} 실패`,
      text:
        error.response?.data?.message ||
        `${postType} 게시글 ${
          isEdit ? '수정' : '등록'
        }에 실패했습니다. 다시 시도해주세요.`,
      icon: 'error',
      confirmButtonText: '확인',
    });
  },

  showError: async (message) => {
    await MySwal.fire({
      title: '오류',
      text: message,
      icon: 'error',
      confirmButtonText: '확인',
    });
  },

  showInfo: async (message) => {
    await MySwal.fire({
      title: '알림',
      text: message,
      icon: 'info',
      confirmButtonText: '확인',
    });
  },

  confirmProductSelect: async (productName) => {
    const result = await MySwal.fire({
      title: '상품 선택 완료',
      text: `${productName} 상품이 선택되었습니다.`,
      icon: 'success',
      confirmButtonText: '확인',
    });
    return result.isConfirmed;
  },

  confirmProductRemove: async () => {
    const result = await MySwal.fire({
      title: '선택된 상품을 제거하시겠습니까?',
      text: '제거된 상품 정보는 복구할 수 없습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '네',
      cancelButtonText: '아니오',
    });

    if (result.isConfirmed) {
      await MySwal.fire(
        '제거 완료',
        '선택된 상품이 제거되었습니다.',
        'success'
      );
    }

    return result.isConfirmed;
  },

  confirmModalClose: async () => {
    const result = await MySwal.fire({
      title: '선택을 취소하시겠습니까?',
      text: '변경사항이 저장되지 않습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니오',
    });
    return result.isConfirmed;
  },
};

export default postAlerts;
