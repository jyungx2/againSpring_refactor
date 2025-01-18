import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postAlerts } from '@/utils/postAlerts';
import useAxiosInstance from '@hooks/useAxiosInstance';

export const useDeletePost = ({ id, queryKey, redirectPath }) => {
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deletePost = useMutation({
    mutationFn: () => axios.delete(`/posts/${id}`),
    onSuccess: async () => {
      queryClient.removeQueries([queryKey, id]);
      queryClient.invalidateQueries(['posts']);
      const confirmed = await postAlerts.showDeleteSuccess();
      if (confirmed) {
        navigate(redirectPath);
      }
    },
  });

  const handleDelete = async () => {
    const isConfirmed = await postAlerts.confirmDelete();
    if (isConfirmed) {
      deletePost.mutate();
    }
  };

  return { deletePost, handleDelete };
};
