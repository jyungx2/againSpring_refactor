import useAxiosInstance from '@hooks/useAxiosInstance';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const useEditPost = (post, initialData = null, returnPath) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null);

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

    if (!title.trim() || !content.trim()) {
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
        content,
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

  const handleDelete = async () => {
    const result = await MySwal.fire({
      title: '게시글 삭제',
      text: '정말로 이 게시글을 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        const response = await axios.delete(`/posts/${post._id}`);

        if (response.data.ok) {
          await MySwal.fire({
            title: '삭제 완료',
            text: '게시글이 성공적으로 삭제되었습니다.',
            icon: 'success',
          });
          navigate(returnPath);
        }
      } catch (error) {
        MySwal.fire({
          title: '오류 발생',
          text:
            error.response?.data?.message ||
            '게시글 삭제 중 오류가 발생했습니다.',
          icon: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    const hasChanges =
      title !== originalData?.title || content !== originalData?.content;

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

  return {
    title,
    setTitle,
    content,
    setContent,
    isLoading,
    handleUpdate,
    handleDelete,
    handleCancel,
  };
};
