import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import PostEditor from '@components/PostEditor';

export default function NoticeEditPostPage() {
  return <PostEditor type='notice' isEdit={true} />;
}
