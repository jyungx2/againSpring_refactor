import CommentListItem from '@pages/comment/CommentListItem';
import CommentNew from '@pages/comment/CommentNew';
import PropTypes from 'prop-types';
import useUserStore from '@store/userStore';

const CommentList = ({ comments = [], postId, post, setReplies }) => {
  const { user } = useUserStore();
  const isAdmin = user?.type === 'admin'; // admin 체크

  return (
    <section className='mb-8'>
      <h4 className='mt-8 mb-4 ml-2'>댓글 {comments.length}개</h4>
      {comments.map((comment) => (
        <CommentListItem
          key={comment.id}
          comment={comment}
          postId={postId}
          isAdmin={isAdmin}
          user={user}
          post={post}
        />
      ))}
      <CommentNew
        postId={postId}
        isAdmin={isAdmin}
        post={post}
        comments={comments}
        setReplies={setReplies}
      />
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
