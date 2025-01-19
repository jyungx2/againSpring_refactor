import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import PostEditor from '@components/PostEditor';

/**
 * 공지사항 수정 페이지
 * PostEditor 컴포넌트를 공지사항 수정 모드로 렌더링
 */
export default function NoticeEditPostPage() {
  return <PostEditor type='notice' isEdit={true} />;
}
