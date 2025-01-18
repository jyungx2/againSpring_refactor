import useAxiosInstance from "@hooks/useAxiosInstance";
import ReviewItem from "@pages/user/ReviewItem";
import Sidebar from "@pages/user/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function ReviewList() {
  const axios = useAxiosInstance();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["replies"],
    queryFn: () => axios.get(`/replies`),
    select: (res) => {
      console.log(res.data);
      return res.data;
    },
  });

  const list = data?.item.map((review, index) => (
    <ReviewItem key={review._id} item={review} count={index + 1} />
  ));

  return (
    <>
      <div className="flex box-border max-w-[1200px] mx-auto px-6 pb-0">
        <Sidebar />

        <div className="flex-grow min-w-0 basis-0 flex flex-col gap-[20px]">
          <div className="flex flex-col border-t-2 border-black p-[30px] pb-[40px] items-start justify-center">
            <div className="flex items-center gap-[18px]">
              <img src="/icons/query.svg" />
              <h1 className="font-gowunBold text-[26px]">후기 내역 조회</h1>
            </div>
          </div>

          <div className="flex flex-col gap-[10px] justify-center border-t border-grey-30 p-[30px] pb-0">
            {data?.item.length > 0 ? (
              <>
                <h2 className="font-gowunBold text-[22px]">후기내역</h2>

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
                    </tr>
                  </thead>

                  <tbody>{list}</tbody>
                </table>
              </>
            ) : (
              <div className="flex justify-center items-center p-[60px]">
                <div>리뷰 내역이 없습니다.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewList;
