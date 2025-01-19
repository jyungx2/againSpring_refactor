import '../../assets/styles/fonts.css';
import PostDetail from '@components/PostDetail';

/**
 * 공지사항 상세 페이지
 * PostDetail 컴포넌트를 공지사항 타입으로 렌더링
 */
export default function NoticePostDetailPage() {
  return <PostDetail type='notice' />;
}
