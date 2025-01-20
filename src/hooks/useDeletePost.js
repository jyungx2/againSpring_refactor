import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postAlerts } from '@/utils/postAlerts';
import useAxiosInstance from '@hooks/useAxiosInstance';

export const useDeletePost = ({ id, queryKey, redirectPath }) => {
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /**
   * 게시글 삭제 뮤테이션
   * 삭제 성공 시 관련 쿼리를 무효화하고 리다이렉트
   */
  const deletePost = useMutation({
    mutationFn: () => axios.delete(`/posts/${id}`),
    onSuccess: async () => {
      // 삭제된 게시글의 상세 데이터 제거
      queryClient.removeQueries([queryKey, id]);
      // 게시글 목록 데이터 갱신
      queryClient.invalidateQueries(['posts']);
      const confirmed = await postAlerts.showDeleteSuccess();
      if (confirmed) {
        navigate(redirectPath);
      }
    },
  });

  /**
   * 게시글 삭제 처리 함수
   * 삭제 전 사용자 확인을 받고 실행
   */
  const handleDelete = async () => {
    const isConfirmed = await postAlerts.confirmDelete();
    if (isConfirmed) {
      deletePost.mutate();
    }
  };

  return { deletePost, handleDelete };
};
