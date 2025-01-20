import useAxiosInstance from '@hooks/useAxiosInstance';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import postAlerts from '@utils/postAlerts';

export const useEditPost = ({
  post,
  initialData = null,
  returnPath,
  postType = 'notice',
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [quillInstance, setQuillInstance] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductPost, setIsProductPost] = useState(false);

  const navigate = useNavigate();
  const axios = useAxiosInstance();
  const MySwal = withReactContent(Swal);

  /**
   * 에디터 내용 초기화 효과
   * quillInstance가 준비되면 기존 게시글 내용을 에디터에 설정
   */
  useEffect(() => {
    if (quillInstance && originalData?.content) {
      quillInstance.root.innerHTML = originalData.content;
    }
  }, [quillInstance, originalData]);

  /**
   * 게시글 데이터 조회 함수
   * @param {string} postId 게시글 ID
   */
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
        if (postType === 'qna' && data.product?._id) {
          setIsProductPost(true);
          setSelectedProduct({
            _id: data.product._id[0],
            name: data.product.name[0],
            mainImages: data.product.mainImages?.[0] || [],
          });
        }

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

  /**
   * 게시글 수정 처리 함수
   * @param {Event} e 이벤트 객체
   */
  const handleUpdate = async (e) => {
    e?.preventDefault();

    const currentContent = quillInstance?.root.innerHTML || '';

    // 입력값 검증
    if (!title.trim() || !currentContent.trim()) {
      await postAlerts.showInfo('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const updateData = {
        title,
        content: currentContent,
      };

      // Q&A 게시글일 경우 상품 정보 추가
      if (postType === 'qna') {
        updateData.product_id = selectedProduct?._id || null;
      }

      const response = await axios.patch(`/posts/${post._id}`, updateData);

      if (response.data.ok) {
        if (
          await postAlerts.showSaveSuccess(
            true,
            postType === 'qna' ? 'Q&A' : '공지사항'
          )
        ) {
          navigate(returnPath);
        }
      }
    } catch (error) {
      await postAlerts.showSaveError(
        error,
        true,
        postType === 'qna' ? 'Q&A' : '공지사항'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 수정 취소 처리 함수
   * 변경사항이 있는 경우 사용자 확인 후 취소
   */
  const handleCancel = async () => {
    const hasChanges =
      postType === 'qna'
        ? title !== originalData?.title ||
          quillInstance?.root.innerHTML !== originalData?.content ||
          selectedProduct?._id !== originalData?.product?._id
        : title !== originalData?.title ||
          quillInstance?.root.innerHTML !== originalData?.content;

    if (hasChanges) {
      if (
        await postAlerts.confirmCancel(
          true,
          postType === 'qna' ? 'Q&A' : '공지사항'
        )
      ) {
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
    setQuillInstance,
    handleUpdate,
    handleCancel,
    selectedProduct: postType === 'qna' ? selectedProduct : undefined,
    setSelectedProduct: postType === 'qna' ? setSelectedProduct : undefined,
    isProductPost: postType === 'qna' ? isProductPost : undefined,
  };
};
