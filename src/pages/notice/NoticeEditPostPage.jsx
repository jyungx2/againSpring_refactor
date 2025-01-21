import "quill/dist/quill.snow.css";
import PostEditor from "@components/PostEditor";
import { Helmet } from "react-helmet-async";

/**
 * 공지사항 수정 페이지
 * PostEditor 컴포넌트를 공지사항 수정 모드로 렌더링
 */
export default function NoticeEditPostPage() {
  return (
    <>
      <Helmet>
        <title>다시, 봄 - 공지사항 수정</title>
        <meta property='og:title' content='다시봄 공지사항 수정' />
        <meta
          property='og:description'
          content='공지사항 수정 페이지 입니다.'
        />
      </Helmet>
      <PostEditor type='notice' isEdit={true} />
    </>
  );
}
