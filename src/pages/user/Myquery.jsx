import useAxiosInstance from "@hooks/useAxiosInstance";
import QnaItem from "@pages/user/QnaItem";
import Sidebar from "@pages/user/Sidebar";
import QnaPagination from "@pages/user/QnaPagination";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";

function Myquery() {
  const navigate = useNavigate();
  const axios = useAxiosInstance();
  const { type } = useParams();
  console.log(type);
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const params = {
    page: searchParams.get("page") || 1, // 페이지
    limit: 4, // 설정 안하면 10이 디폴트값
  };

  const { data } = useQuery({
    queryKey: ["posts", params],
    queryFn: () => axios.get(`/posts/users?type=${type}`, { params }),
    select: (res) => {
      console.log(res.data);
      return res.data;
    },
  });

  const totalPages = data?.pagination.totalPages;
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const QnaList = data?.item.map((qna, index) => (
    <QnaItem key={qna._id} item={qna} count={index + 1} />
  ));

  return (
    <>
      <div className="flex box-border max-w-[1200px] mx-auto px-6 pb-0">
        <Sidebar />

        <div className="flex-grow min-w-0 basis-0 flex flex-col gap-[20px]">
          <div className="flex flex-col border-t-2 border-black p-[30px] pb-[40px] items-start justify-center">
            <div className="flex items-center gap-[18px]">
              <img src="/icons/query.svg" />
              <h1 className="font-gowunBold text-[26px]">문의 내역 확인</h1>
            </div>

            <div className="ml-auto">
              <button
                onClick={() => navigate("/qna")}
                className="font-gowunBold inline-block h-[42px] text-primary-70 text-[16px] px-[24px] border border-primary-30 rounded-[2px] box-border cursor-pointer"
              >
                문의하러 가기
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-[10px] justify-center border-t border-grey-30 p-[30px] pb-0">
            {data?.item.length > 0 ? (
              <>
                <h2 className="font-gowunBold text-[22px]">문의내역</h2>

                <table className="w-full border-collapse my-[20px] table-fixed">
                  <thead className="bg-grey-5 font-gowunBold">
                    <tr>
                      <th className="border border-grey-30 text-center p-[8px] w-[10%]">
                        번호
                      </th>
                      <th className="border border-grey-30 text-center p-[8px] w-[50%]">
                        제목
                      </th>
                      <th className="border border-grey-30 text-center p-[8px] w-[15%]">
                        작성일
                      </th>
                      <th className="border border-grey-30 text-center p-[8px] w-[12.5%]">
                        작성자
                      </th>
                      <th className="border border-grey-30 text-center p-[8px] w-[8%]">
                        조회수
                      </th>
                    </tr>
                  </thead>

                  <tbody>{QnaList}</tbody>
                </table>

                {data && (
                  <QnaPagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="flex justify-center items-center p-[60px]">
                <div>문의 내역이 없습니다.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Myquery;
