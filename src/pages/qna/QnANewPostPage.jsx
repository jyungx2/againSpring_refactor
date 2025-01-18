import { useNavigate } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import { QUILL_FORMATS, QUILL_MODULES } from '@constants/editorConfig';
import { handleImageUpload } from '@utils/imageUpload';
import useAxiosInstance from '@hooks/useAxiosInstance';
import { useQueryClient } from '@tanstack/react-query';
import useProductModal from '@hooks/useProductModal';
import PostForm from '@components/PostForm';
import postAlerts from '@utils/postAlerts';

export default function QnANewPostPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axios = useAxiosInstance();

  const [title, setTitle] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { quill, quillRef } = useQuill({
    modules: QUILL_MODULES,
    formats: QUILL_FORMATS,
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
      quill
        .getModule('toolbar')
        .addHandler('image', () => handleImageUpload(quill));
    }
  }, [quill]);

  const handleCancel = async () => {
    const hasContent =
      title.trim() !== '' || (quill && quill.getText().trim() !== '');

    if (hasContent) {
      if (await postAlerts.confirmCancel()) {
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

    if (await postAlerts.confirmSave()) {
      try {
        const response = await axios.post('/posts', data);
        if (response.data.ok === 1) {
          await queryClient.invalidateQueries({ queryKey: ['posts', 'qna'] });
          if (await postAlerts.showSaveSuccess()) {
            navigate('/qna');
          }
        }
      } catch (error) {
        await postAlerts.showSaveError(error);
      }
    }
  };

  return (
    <PostForm
      type='qna'
      title={title}
      setTitle={setTitle}
      quillRef={quillRef}
      selectedProduct={selectedProduct}
      isProductPost={true}
      isModalOpen={isModalOpen}
      openModal={openModal}
      closeModal={closeModal}
      handleProductSelect={handleProductSelect}
      handleProductRemove={handleProductRemove}
      handleSave={handleSave}
      handleCancel={handleCancel}
    />
  );
}
