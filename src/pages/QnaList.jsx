// components/QnAList.jsx
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useAxiosInstance from "@hooks/useAxiosInstance";

function QnAList(productId) {
  const axiosInstance = useAxiosInstance();

  const {
    data: qnas,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", "qna", productId],
    queryFn: () =>
      axiosInstance.get("/posts", {
        params: {
          type: "qna",
          page: 1,
          limit: 1000,
          // *custom: 서버가 MongoDB처럼 JSON 조건을 필터로 처리할 때 자주 사용
          custom: JSON.stringify({ product_id: Number(productId) }), // URL 쿼리스트링은 객체를 그대로 보낼 수 없기 때문(HTTP 요청의 쿼리스트링은 문자열만 허용)에 JSON 문자열로 변환하여 Url 쿼리에 맞게 전달..
          // 🔥 서버가 JSON(Javasrcipt Object Notation: 자바스크립트 객체 문법을 따르는 데이터 교환 형식) 문자열을 기대(MongoDB 쿼리용 필터로 파싱할 때 쓰이는 문자형태)하기 때문에 자바스크립트 객체인 { product_id: 1 }를 문자열로 바꿔줘야 한다!
          // ❌ 이때, JSON.stringify 없이는, 주소창: "custom=[object Object]"
          // ✅ 주소창: ?custom={"product_id":1} 라고 보내기 위해 JSON 문자화 시켜줄 필요!

          // ❓ 서버는 왜 이렇게 받게 되어 있을까?
          // => MongoDB 기반의 API (예: Nest.js, Express + Mongoose)에서는 custom이라는 필드로 ✨JSON 문자열✨을 받아서 내부에서 JSON.parse()로 파싱하고, 그걸 필터 조건으로 사용하는 구조를 자주 씁니다.
        },
      }),
    select: (res) => res.data.item,
  });

  if (isLoading) return <p>QnA 불러오는 중...</p>;
  if (error) return <p>QnA를 불러오는 데 실패했습니다.</p>;

  // const filteredQnas = qnas?.filter(
  //   (qna) => qna.product_id === parseInt(productId)
  // );

  return (
    <ul>
      {qnas?.length > 0 ? (
        qnas.map((qna) => (
          <li key={qna._id}>
            <Link to={`/qna/detail/${qna._id}`}>{qna.title}</Link>
          </li>
        ))
      ) : (
        <li>QnA가 없습니다.</li>
      )}
    </ul>
  );
}

export default QnAList;
