import useAxiosInstance from '@hooks/useAxiosInstance';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const useQnAEditPost = (post, initialData = null, returnPath) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [quillInstance, setQuillInstance] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();
  const axios = useAxiosInstance();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setOriginalData(initialData);
    }
  }, [initialData]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const currentContent = quillInstance?.root.innerHTML || '';

    if (!title.trim() || !currentContent.trim()) {
      MySwal.fire({
        title: '입력 확인',
        text: '제목과 내용을 모두 입력해주세요.',
        icon: 'warning',
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.patch(`/posts/${post._id}`, {
        title,
        content: currentContent,
        ...(selectedProduct && { product_id: selectedProduct._id }),
      });

      if (response.data.ok) {
        await MySwal.fire({
          title: '수정 완료',
          text: '게시글이 성공적으로 수정되었습니다.',
          icon: 'success',
        });
        navigate(returnPath);
      }
    } catch (error) {
      MySwal.fire({
        title: '오류 발생',
        text:
          error.response?.data?.message ||
          '게시글 수정 중 오류가 발생했습니다.',
        icon: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const hasChanges =
      title !== originalData?.title ||
      content !== originalData?.content ||
      selectedProduct?._id !== originalData?.product_id;

    if (hasChanges) {
      MySwal.fire({
        title: '수정 취소',
        text: '변경사항이 저장되지 않습니다. 취소하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '예',
        cancelButtonText: '아니오',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(returnPath);
        }
      });
    } else {
      navigate(returnPath);
    }
  };

  const fetchPostData = async (postId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/posts/${postId}`);

      if (response.data.ok) {
        const data = response.data.item;
        setTitle(data.title);
        setContent(data.content);
        setOriginalData(data);

        // 상품 정보가 있는 경우 상품 데이터 조회
        if (data.product_id) {
          try {
            const productResponse = await axios.get(
              `/products/${data.product_id}`
            );
            if (productResponse.data.ok) {
              setSelectedProduct(productResponse.data.item);
            }
          } catch (productError) {
            console.error('상품 정보 로딩 중 오류 발생:', productError);
          }
        }

        // Quill 에디터 내용 설정
        if (quillInstance) {
          quillInstance.root.innerHTML = data.content;
        }
      }
    } catch (error) {
      MySwal.fire({
        title: '오류 발생',
        text:
          error.response?.data?.message ||
          '게시글 로딩 중 오류가 발생했습니다.',
        icon: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (post._id) {
      fetchPostData(post._id);
    }
  }, [post._id]);

  return {
    title,
    setTitle,
    content,
    setContent,
    isLoading,
    setQuillInstance,
    handleUpdate,
    handleCancel,
  };
};
