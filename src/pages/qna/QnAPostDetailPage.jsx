import { useState } from 'react';
import '../../assets/styles/fonts.css';
import PostDetail from '@components/PostDetail';
import { Helmet } from 'react-helmet-async';

/**
 * Q&A 게시글 상세 페이지
 * PostDetail 컴포넌트를 Q&A 타입으로 렌더링
 */
export default function QnAPostDetailPage() {
  const [postData, setPostData] = useState(null);

  const handleDataLoad = (data) => {
    setPostData(data);
  };

  return (
    <>
      <Helmet>
        <title>
          {postData ? `다시, 봄 - ${postData.title}` : '다시, 봄 - Q&A 상세'}
        </title>
        <meta
          property='og:title'
          content={postData ? `다시봄 - ${postData.title}` : '다시봄 Q&A 상세'}
        />
        <meta
          property='og:description'
          content={postData?.content || 'Q&A 상세 페이지 입니다.'}
        />
      </Helmet>
      <PostDetail type='qna' onDataLoad={handleDataLoad} />
    </>
  );
}
