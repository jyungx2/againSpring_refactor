import PropTypes from "prop-types";
import { useState } from "react";
import useUserStore from "@store/userStore";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosInstance from "@hooks/useAxiosInstance";

const CommentNew = ({ isAdmin, post, comments, setReplies }) => {
  const axios = useAxiosInstance();
  const queryClient = useQueryClient();
  const MySwal = withReactContent(Swal);
  const { user } = useUserStore();

  const [content, setContent] = useState("");

  const createComment = useMutation({
    mutationFn: (data) => axios.post(`/posts/${post._id}/replies`, data),
    onSuccess: (response) => {
      const newComment = response.data.item;
      setReplies([...comments, newComment]);
      setContent("");

      queryClient.invalidateQueries(["qnaDetail", post._id.toString()]);

      queryClient.invalidateQueries(["posts"]);

      MySwal.fire({
        title: "등록 완료",
        text: "댓글이 등록되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(isAdmin || post?.user?._id === user?._id)) {
      MySwal.fire({
        title: "권한 없음",
        text: "답변은 작성자와 관리자만 댓글을 작성할 수 있습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    if (!content.trim()) {
      MySwal.fire({
        title: "알림",
        text: "댓글 내용을 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    createComment.mutate({ content });
  };

  return (
    <div className='flex flex-col gap-4 border border-grey-5 p-6 mb-6'>
      <textarea
        className='w-full min-h-[80px] resize-y border border-grey-30 p-2 text-xl'
        placeholder={
          !(isAdmin || post?.user?._id === user?._id)
            ? "답변은 작성자와 관리자만 작성할 수 있습니다."
            : "댓글을 입력하세요"
        }
        disabled={!(isAdmin || post?.user?._id === user?._id)}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className='flex justify-end gap-2'>
        <button
          type='submit'
          onClick={handleSubmit}
          disabled={!(isAdmin || post?.user?._id === user?._id)}
          className={`rounded-lg px-6 py-2 ${
            !(isAdmin || post?.user?._id === user?._id)
              ? "bg-grey-20"
              : "bg-secondary-20"
          } text-white`}
        >
          작성
        </button>
      </div>
    </div>
  );
};

export default CommentNew;

CommentNew.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  post: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    user: PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }),
    replies: PropTypes.array,
  }).isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
  setReplies: PropTypes.func.isRequired,
};
