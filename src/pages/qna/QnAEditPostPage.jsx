import { useParams } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import { QUILL_FORMATS, QUILL_MODULES } from '@constants/editorConfig';
import { handleImageUpload } from '@utils/imageUpload';
import { useEditPost } from '@hooks/useEditPost';
import QnAAlerts from '@utils/qnaAlerts';
import { useProductModal } from '@hooks/useProductModal';
import QnAPostForm from '@components/QnAPostForm';

export default function QnAEditPostPage() {
  const { id } = useParams();

  const { quill, quillRef } = useQuill({
    modules: QUILL_MODULES,
    formats: QUILL_FORMATS,
  });

  const {
    title,
    setTitle,
    isLoading,
    setQuillInstance,
    handleUpdate,
    handleCancel,
    selectedProduct,
    setSelectedProduct,
    isProductPost,
  } = useEditPost({
    post: { _id: id },
    returnPath: `/qna/detail/${id}`,
    postType: 'qna',
  });

  const {
    isModalOpen,
    openModal,
    closeModal,
    handleProductSelect,
    handleProductRemove,
  } = useProductModal({
    selectedProduct,
    setSelectedProduct,
  });

  useEffect(() => {
    if (quill) {
      setQuillInstance(quill);
      quill
        .getModule('toolbar')
        .addHandler('image', () => handleImageUpload(quill));
    }
  }, [quill, setQuillInstance]);

  const handleEditCancel = async () => {
    const hasContent =
      title.trim() !== '' || (quill && quill.getText().trim() !== '');
    if (hasContent) {
      if (await QnAAlerts.confirmCancel(true)) {
        handleCancel();
      }
    } else {
      handleCancel();
    }
  };

  const handleEditUpdate = async () => {
    if (await QnAAlerts.confirmSave(true)) {
      try {
        await handleUpdate();
      } catch (error) {
        await QnAAlerts.showSaveError(error, true);
      }
    }
  };

  return (
    <QnAPostForm
      isEdit={true}
      title={title}
      setTitle={setTitle}
      quillRef={quillRef}
      selectedProduct={selectedProduct}
      isProductPost={isProductPost}
      isModalOpen={isModalOpen}
      isLoading={isLoading}
      openModal={openModal}
      closeModal={closeModal}
      handleProductSelect={handleProductSelect}
      handleProductRemove={handleProductRemove}
      handleSave={handleEditUpdate}
      handleCancel={handleEditCancel}
    />
  );
}
