import "quill/dist/quill.snow.css";
import PostEditor from "@components/PostEditor";
import { Helmet } from "react-helmet-async";

/**
 * Q&A 게시글 수정 페이지
 * PostEditor 컴포넌트를 Q&A 수정 모드로 렌더링
 */
export default function QnAEditPostPage() {
  return (
    <>
      <Helmet>
        <title>다시, 봄 - Q&A 수정</title>
        <meta property='og:title' content='다시봄 Q&A 수정' />
        <meta property='og:description' content='Q&A 수정 페이지 입니다.' />
      </Helmet>
      <PostEditor type='qna' isEdit={true} />
    </>
  );
}
