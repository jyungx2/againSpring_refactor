import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import PostEditor from '@components/PostEditor';
import { Helmet } from 'react-helmet-async';

/**
 * 새 공지사항 작성 페이지
 * PostEditor 컴포넌트를 공지사항 작성 모드로 렌더링
 */
export default function NoticeNewPostPage() {
  return (
    <>
      <Helmet>
        <title>다시, 봄 - 공지사항 등록</title>
        <meta property='og:title' content='다시봄 공지사항 등록' />
        <meta
          property='og:description'
          content='공지사항 등록 페이지 입니다.'
        />
      </Helmet>
      <PostEditor type='notice' isEdit={false} />
    </>
  );
}
