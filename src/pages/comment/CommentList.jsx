import CommentListItem from '@pages/comment/CommentListItem';
import CommentNew from '@pages/comment/CommentNew';
import PropTypes from 'prop-types';

/**
 * TODO 댓글목록
 * - comments 배열을 props로 받아서 CommentListItem을 반복 렌더링
 * - 댓글 개수 표시
 * - CommentNew 컴포넌트 포함
 */
const CommentList = ({ comments = [], postId, isAdmin = false }) => {
  return (
    <section className='mb-8'>
      <h4 className='mt-8 mb-4 ml-2'>댓글 {comments.length}</h4>
      {comments.map((comment) => (
        <CommentListItem key={comment.id} comment={comment} postId={postId} />
      ))}
      <CommentNew postId={postId} isAdmin={isAdmin} />
    </section>
  );
};

export default CommentList;

CommentList.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  postId: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool,
};
