import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useAxiosInstance from "@hooks/useAxiosInstance";

const InfoSection = () => {
  const axiosInstance = useAxiosInstance();

  // 공지사항 데이터 가져오기
  const { data: notices, isLoading: noticesLoading, error: noticesError } = useQuery({
    queryKey: ["posts", "notice", "main"],
    queryFn: () =>
      axiosInstance.get("/posts", {
        params: {
          type: "notice",
          page: 1,
          limit: 5,
        },
      }),
    select: (res) => res.data.item,
    staleTime: 1000 * 10, // 데이터 유효성 제어 (10초) 불필요한 요청 방지
  });

  // Q&A 데이터 가져오기
  const { data: qnas, isLoading: qnasLoading, error: qnasError } = useQuery({
    queryKey: ["posts", "qna", "main"],
    queryFn: () =>
      axiosInstance.get("/posts", {
        params: {
          type: "qna",
          page: 1,
          limit: 5,
        },
      }),
    select: (res) => res.data.item,
    staleTime: 1000 * 10,
  });

  if (noticesLoading || qnasLoading) return <div>로딩 중...</div>;
  if (noticesError || qnasError) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <div className="w-full px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 gap-8 mt-10">
          {/* 공지사항 */}
          <div className="border-b border-gray-300 rounded-md overflow-hidden">
            <div className="flex justify-between items-center py-4 px-6 border-b border-gray-300">
              <h3 className="text-3xl font-bold">공지사항</h3>
              <Link to="/notice">
                <button
                  className="w-8 h-8 hover:opacity-80 focus:outline-none"
                  aria-label="공지사항 더보기"
                >
                  <img src="/icons/plus.svg" alt="더보기" />
                </button>
              </Link>
            </div>
            <ul className="space-y-3 px-6 py-4">
              {notices?.map((notice) => (
                <li key={notice._id} className="flex justify-between items-center text-lg py-2">
                  <Link to={`/notice/detail/${notice._id}`} className="text-gray-800 hover:underline">
                    • {notice.title}
                  </Link>
                  <span className="text-gray-500">{notice.createdAt.split("T")[0]}</span>
                </li>
              ))}
              {notices?.length === 0 && <p>공지사항이 없습니다.</p>}
            </ul>
          </div>

          {/* Q&A */}
          <div className="border-b border-gray-300 rounded-md overflow-hidden">
            <div className="flex justify-between items-center py-4 px-6 border-b border-gray-300">
              <h3 className="text-3xl font-bold">Q&A</h3>
              <Link to="/qna">
                <button
                  className="w-8 h-8 hover:opacity-80 focus:outline-none"
                  aria-label="Q&A 더보기"
                >
                  <img src="/icons/plus.svg" alt="더보기" />
                </button>
              </Link>
            </div>
            <ul className="space-y-3 px-6 py-4">
              {qnas?.map((qna) => (
                <li key={qna._id} className="flex justify-between items-center text-lg py-2">
                  <Link to={`/qna/detail/${qna._id}`} className="text-gray-800 hover:underline">
                    • {qna.title}
                  </Link>
                  <span className="text-gray-500">{qna.createdAt.split("T")[0]}</span>
                </li>
              ))}
              {qnas?.length === 0 && <p>Q&A가 없습니다.</p>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
