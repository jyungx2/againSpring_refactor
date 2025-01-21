import { Helmet } from "react-helmet-async";
import PostDetail from "@components/PostDetail";
import { useState } from "react";

/**
 * 공지사항 상세 페이지
 * PostDetail 컴포넌트를 공지사항 타입으로 렌더링
 */
export default function NoticePostDetailPage() {
  const [postData, setPostData] = useState(null);

  const handleDataLoad = (data) => {
    setPostData(data);
  };
  return (
    <>
      <Helmet>
        <title>
          {postData
            ? `다시, 봄 - ${postData.title}`
            : "다시, 봄 - 공지사항 상세"}
        </title>
        <meta
          property='og:title'
          content={
            postData ? `다시봄 - ${postData.title}` : "다시봄 공지사항 상세"
          }
        />
        <meta
          property='og:description'
          content={postData?.content || "공지사항 상세 페이지 입니다."}
        />
      </Helmet>
      <PostDetail type='notice' onDataLoad={handleDataLoad} />
    </>
  );
}
