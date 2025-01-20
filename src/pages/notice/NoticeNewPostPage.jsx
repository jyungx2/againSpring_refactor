import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import PostEditor from '@components/PostEditor';

/**
 * 새 공지사항 작성 페이지
 * PostEditor 컴포넌트를 공지사항 작성 모드로 렌더링
 */
export default function NoticeNewPostPage() {
  return <PostEditor type='notice' isEdit={false} />;
}
