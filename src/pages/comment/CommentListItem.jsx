import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * TODO 댓글 아이템
 * - 개별 댓글 아이템 표시
 * - 수정/삭제 기능 포함
 * - 사용자 권한에 따른 UI 처리
 */
const CommentListItem = ({ comment, postId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleUpdate = async () => {
    // API 호출 로직
    setIsEditing(false);
  };

  const handleDelete = async () => {
    // API 호출 로직
  };

  return (
    <div className='py-8 border-b border-grey-10'>
      <div className='flex items-center'>
        <span className='text-2xl font-medium'>{comment.name}</span>
        <span className='text-2xl font-normal'>{comment.createdAt}</span>
      </div>
      {isEditing ? (
        <div className='mt-4 p-6'>
          <textarea
            className='w-full min-h-[80px] resize-y border border-grey-30 p-2 rounded text-2xl'
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className='flex gap-2 mt-2 justify-end'>
            <button
              type='button'
              className='rounded-lg px-6 py-2 bg-secondary-20 text-white text-2xl cursor-pointer'
              onClick={handleUpdate}
            >
              수정완료
            </button>
            <button
              type='button'
              className='rounded-lg bg-grey-20 text-white px-6 py-2 text-2xl'
              onClick={() => setIsEditing(false)}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className='text-xl text-grey-80 mt-4 pl-3'>{comment.content}</p>
          <div className='flex mt-4'>
            <button
              type='button'
              className='text-2xl text-grey-40 hover:text-grey-70 font-normal relative ml-4'
              onClick={() => setIsEditing(true)}
            >
              수정
            </button>
            <button
              type='button'
              className="text-2xl text-grey-40 hover:text-grey-70 font-normal relative ml-4 before:content-['/'] before:absolute before:left-[-8px]"
              onClick={handleDelete}
            >
              삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CommentListItem;

CommentListItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  postId: PropTypes.string.isRequired,
};
