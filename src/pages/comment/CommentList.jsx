import CommentListItem from '@pages/comment/CommentListItem';
import CommentNew from '@pages/comment/CommentNew';
import PropTypes from 'prop-types';
import useUserStore from '@store/userStore';

const CommentList = ({ comments = [], post, setReplies }) => {
  const { user } = useUserStore();
  const isAdmin = user?.type === 'admin'; // admin 체크

  return (
    <section className='mb-8'>
      <h4 className='mt-8 mb-4 ml-2'>댓글 {comments.length}개</h4>
      {comments.map((comment) => (
        <CommentListItem
          key={comment.id}
          comment={comment}
          isAdmin={isAdmin}
          user={user}
          post={post}
        />
      ))}
      <CommentNew
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
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      createdAt: PropTypes.string.isRequired,
    })
  ),
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  setReplies: PropTypes.func.isRequired,
};
