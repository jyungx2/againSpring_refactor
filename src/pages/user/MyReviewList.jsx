import useAxiosInstance from "@hooks/useAxiosInstance";
import ReviewItem from "@pages/user/ReviewItem";
import Sidebar from "@pages/user/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

function MyReviewList() {
  const axios = useAxiosInstance();

  const { data } = useQuery({
    queryKey: ["replies"],
    queryFn: () => axios.get(`/replies`),
    select: (res) => {
      console.log(res.data);
      return res.data;
    },
  });

  const list = data?.item.map((review) => (
    <ReviewItem key={review._id} item={review} />
  ));

  return (
    <>
      <Helmet>
        <title>다시, 봄 - 후기조회</title>
        <meta property="og:title" content="다시봄 후기조회" />
        <meta
          property="og:description"
          content="내가 작성한 리뷰를 확인하고, 필요한 경우 수정하거나 삭제할 수 있습니다."
        />
      </Helmet>

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

export default MyReviewList;
