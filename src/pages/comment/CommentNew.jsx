import PropTypes from 'prop-types';
import { useState } from 'react';

/**
 * TODO 댓글 등록
 * - 새 댓글 작성 폼
 * - 댓글 개수 표시
 * - 사용자 권한에 따른 UI 처리
 */
const CommentNew = ({ postId, isAdmin = false }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    // API 호출 로직
    setContent('');
  };

  return (
    <div className='flex flex-col gap-4 border border-grey-5 p-6 mb-6'>
      <textarea
        className='w-full min-h-[80px] resize-y border border-grey-30 p-2 text-xl'
        placeholder={
          isAdmin ? '댓글을 입력하세요' : '답변은 관리자만 작성할 수 있습니다.'
        }
        disabled={!isAdmin}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className='flex justify-end gap-2'>
        <button
          type='submit'
          onClick={handleSubmit}
          disabled={!isAdmin}
          className={`rounded-lg px-6 py-2 ${
            isAdmin ? 'bg-secondary-20' : 'bg-grey-20'
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
  postId: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool,
};
