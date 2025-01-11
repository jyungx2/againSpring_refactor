import PropTypes from 'prop-types';
import { useState } from 'react';
import useUserStore from '@store/userStore';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const CommentNew = ({ isAdmin, post, comments, setReplies }) => {
  const { user } = useUserStore();
  const [content, setContent] = useState('');
  const MySwal = withReactContent(Swal);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(isAdmin || post?.user?._id === user?._id)) {
      MySwal.fire({
        title: '권한 없음',
        text: '답변은 작성자와 관리자만 댓글을 작성할 수 있습니다.',
        icon: 'warning',
        confirmButtonText: '확인',
      });
      return;
    }

    if (!content.trim()) {
      MySwal.fire({
        title: '알림',
        text: '댓글 내용을 입력해주세요.',
        icon: 'warning',
        confirmButtonText: '확인',
      });
      return;
    }

    const data = {
      content: content,
    };

    const saveData = async () => {
      // 서버에 게시글 저장 요청
      const response = await fetch(
        `https://11.fesp.shop/posts/${post._id}/replies`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'client-id': 'final02',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      /**
       * 리액트 새로고침 되는 기준 useState로 관리되는 모든 자원들의 값이 변화가 있으면
       * 리액트에서는 부분 새로고침이 일어남
       * 그래서 useState로 replies를 관리하게 해서 강제로 새로고침을 일어나게함
       */
      const result = await response.json();
      if (result.item && result.ok === 1) {
        setReplies([...comments, result.item]);
        setContent('');
        MySwal.fire({
          title: '등록 완료',
          text: '댓글이 등록되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
        });
      }
    };

    saveData();
  };

  return (
    <div className='flex flex-col gap-4 border border-grey-5 p-6 mb-6'>
      <textarea
        className='w-full min-h-[80px] resize-y border border-grey-30 p-2 text-xl'
        placeholder={
          // 관리자도 아니고 작성자도 아니라면 작성권한 없음
          !(isAdmin || post?.user?._id === user?._id)
            ? '답변은 작성자와 관리자만 작성할 수 있습니다.'
            : '댓글을 입력하세요'
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
              ? 'bg-secondary-20bg-grey-20'
              : 'bg-secondary-20'
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
    _id: PropTypes.string.isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
    replies: PropTypes.array,
  }).isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
  setReplies: PropTypes.func.isRequired,
};
