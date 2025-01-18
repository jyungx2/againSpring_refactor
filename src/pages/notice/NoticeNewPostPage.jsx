import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import PostEditor from '@components/PostEditor';

export default function NoticeNewPostPage() {
  return <PostEditor type='notice' isEdit={false} />;
}
