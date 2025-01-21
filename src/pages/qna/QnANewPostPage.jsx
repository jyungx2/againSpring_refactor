import 'quill/dist/quill.snow.css';
import '../../assets/styles/fonts.css';
import PostEditor from '@components/PostEditor';
import { Helmet } from 'react-helmet-async';

/**
 * Q&A 게시글 작성 페이지
 * PostEditor 컴포넌트를 Q&A 작성 모드로 렌더링
 */
export default function QnANewPostPage() {
  return (
    <>
      <Helmet>
        <title>다시, 봄 - Q&A 등록</title>
        <meta property='og:title' content='다시봄 Q&A 등록' />
        <meta property='og:description' content='Q&A 등록 페이지 입니다.' />
      </Helmet>
      <PostEditor type='qna' isEdit={false} />
    </>
  );
}
