import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import PostEditor from '@components/PostEditor';

export default function QnANewPostPage() {
  return <PostEditor type='qna' isEdit={false} />;
}
