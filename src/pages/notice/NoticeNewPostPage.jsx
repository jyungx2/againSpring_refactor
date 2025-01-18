import { useNavigate } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import { handleImageUpload } from '@utils/imageUpload';
import { QUILL_FORMATS, QUILL_MODULES } from '@constants/editorConfig';
import useAxiosInstance from '@hooks/useAxiosInstance';
import { useQueryClient } from '@tanstack/react-query';
import PostAlerts from '@utils/postAlerts';
import PostForm from '@components/PostForm';

export default function NoticeNewPostPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const axios = useAxiosInstance();

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

  const handleCancel = async () => {
    const hasContent =
      title.trim() !== '' || (quill && quill.getText().trim() !== '');

    if (hasContent) {
      if (await PostAlerts.confirmCancel(false, '공지사항')) {
        navigate('/notice');
      }
    } else {
      navigate('/notice');
    }
  };

  const handleSave = async () => {
    const data = {
      type: 'notice',
      title: title,
      content: quill.root.innerHTML,
    };

    if (await PostAlerts.confirmSave(false, '공지사항')) {
      try {
        const response = await axios.post('/posts', data);
        if (response.data.ok === 1) {
          await queryClient.invalidateQueries({
            queryKey: ['posts', 'notice'],
          });
          if (await PostAlerts.showSaveSuccess(false, '공지사항')) {
            navigate('/notice');
          }
        }
      } catch (error) {
        await PostAlerts.showSaveError(error, false, '공지사항');
      }
    }
  };

  return (
    <PostForm
      type='notice'
      title={title}
      setTitle={setTitle}
      quillRef={quillRef}
      handleSave={handleSave}
      handleCancel={handleCancel}
    />
  );
}
