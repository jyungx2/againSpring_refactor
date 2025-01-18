import { useParams } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import { QUILL_FORMATS, QUILL_MODULES } from '@constants/editorConfig';
import { handleImageUpload } from '@utils/imageUpload';
import { useEditPost } from '@hooks/useEditPost';
import PostForm from '@components/PostForm';

export default function NoticeEditPostPage() {
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
  } = useEditPost({
    post: { _id: id },
    returnPath: `/notice/detail/${id}`,
    postType: 'notice',
  });

  useEffect(() => {
    if (quill) {
      setQuillInstance(quill);
      quill
        .getModule('toolbar')
        .addHandler('image', () => handleImageUpload(quill));
    }
  }, [quill, setQuillInstance]);

  return (
    <PostForm
      type='notice'
      isEdit={true}
      title={title}
      setTitle={setTitle}
      quillRef={quillRef}
      isLoading={isLoading}
      handleSave={handleUpdate}
      handleCancel={handleCancel}
    />
  );
}
