import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import useAxiosInstance from '@hooks/useAxiosInstance';
import postAlerts from '@utils/postAlerts';

/**
 * 게시글 데이터 조회 함수
 * @param {string} postId 게시글 ID
 */
export default function usePostEditor({
  type,
  isEdit,
  post = null,
  returnPath,
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axios = useAxiosInstance();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [quillInstance, setQuillInstance] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchPostData = async (postId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/posts/${postId}`);

      if (response.data.ok) {
        const data = response.data.item;
        setTitle(data.title);
        setContent(data.content);
        setOriginalData(data);

        // Q&A 게시글의 경우 상품 정보 설정
        if (type === 'qna' && data.product?._id) {
          setSelectedProduct({
            _id: data.product._id[0],
            name: data.product.name[0],
            mainImages: data.product.mainImages?.[0] || [],
          });
        }
      }
    } catch (error) {
      await postAlerts.showError(
        error.response?.data?.message || '게시글 로딩 중 오류가 발생했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Quill 에디터 내용 설정 효과
   */
  useEffect(() => {
    if (quillInstance && content) {
      quillInstance.root.innerHTML = content;
    }
    console.log('무한무한무한 ');
    console.log(quillInstance);
    console.log(content);
  }, [quillInstance, content]);

  useEffect(() => {
    if (isEdit && post?._id) {
      fetchPostData(post._id);
    }
    console.log('무한무한무한222');
    console.log(isEdit);
    console.log(post?._id);
  }, [isEdit, post?._id]);

  /**
   * 게시글 저장 처리 함수
   * @param {Event} e 이벤트 객체
   */
  const handleSave = async (e) => {
    e?.preventDefault();

    const currentContent = quillInstance?.root.innerHTML || '';

    // 입력값 검증
    if (!title.trim() || !currentContent.trim()) {
      await postAlerts.showInfo('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const postType = type === 'qna' ? 'Q&A' : '공지사항';

    try {
      setIsLoading(true);

      const postData = {
        type,
        title: title.trim(),
        content: currentContent,
        ...(type === 'qna' &&
          selectedProduct?._id && {
            product_id: selectedProduct._id,
          }),
      };

      // 저장 확인 후 처리
      if (await postAlerts.confirmSave(isEdit, postType)) {
        const response = isEdit
          ? await axios.patch(`/posts/${post._id}`, postData)
          : await axios.post('/posts', postData);

        if (response.data.ok) {
          await queryClient.invalidateQueries(['posts', type]);
          if (await postAlerts.showSaveSuccess(isEdit, postType)) {
            navigate(returnPath);
          }
        }
      }
    } catch (error) {
      await postAlerts.showSaveError(error, isEdit, postType);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    const hasChanges = isEdit
      ? type === 'qna'
        ? title !== originalData?.title ||
          quillInstance?.root.innerHTML !== originalData?.content ||
          selectedProduct?._id !== originalData?.product?._id
        : title !== originalData?.title ||
          quillInstance?.root.innerHTML !== originalData?.content
      : title.trim() !== '' ||
        (quillInstance && quillInstance.getText().trim() !== '');

    const postType = type === 'qna' ? 'Q&A' : '공지사항';

    if (hasChanges) {
      if (await postAlerts.confirmCancel(isEdit, postType)) {
        navigate(returnPath);
      }
    } else {
      navigate(returnPath);
    }
  };

  return {
    title,
    setTitle,
    content,
    isLoading,
    quillInstance,
    setQuillInstance,
    selectedProduct,
    setSelectedProduct,
    handleSave,
    handleCancel,
  };
}
