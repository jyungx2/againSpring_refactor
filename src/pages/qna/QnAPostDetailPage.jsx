import '../../assets/styles/fonts.css';
import PostDetail from '@components/PostDetail';

/**
 * Q&A 게시글 상세 페이지
 * PostDetail 컴포넌트를 Q&A 타입으로 렌더링
 */
export default function QnAPostDetailPage() {
  return <PostDetail type='qna' />;
}
