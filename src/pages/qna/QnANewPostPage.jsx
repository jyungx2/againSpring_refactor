import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import PostEditor from '@components/PostEditor';

/**
 * Q&A 게시글 작성 페이지
 * PostEditor 컴포넌트를 Q&A 작성 모드로 렌더링
 */
export default function QnANewPostPage() {
  return <PostEditor type='qna' isEdit={false} />;
}
