import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import PostEditor from '@components/PostEditor';

/**
 * Q&A 게시글 수정 페이지
 * PostEditor 컴포넌트를 Q&A 수정 모드로 렌더링
 */
export default function QnAEditPostPage() {
  return <PostEditor type='qna' isEdit={true} />;
}
