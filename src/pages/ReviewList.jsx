import useAxiosInstance from "@hooks/useAxiosInstance";
import ReviewItem from "@pages/user/ReviewItem";
import { useQuery } from "@tanstack/react-query";

function ReviewList({ productId }) {
  const axios = useAxiosInstance();

  const { data, isLoading, error } = useQuery({
    queryKey: ["replies", productId],
    queryFn: () =>
      axios.get(`/replies`, {
        params: { productId }, // 상품 ID 전달
      }),
    select: (res) => res.data.item, // 필요한 데이터 선택
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>리뷰를 가져오는 중 오류가 발생했습니다.</div>;
  }

  const list = data?.map((review) => (
    <ReviewItem key={review._id} item={review} />
  ));

  return (
    <div className="flex box-border max-w-[1200px] mx-auto px-6 pb-0">
      <div className="flex-grow min-w-0 basis-0 flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[10px] justify-center border-t border-grey-30 p-[30px] pb-0">
          {data?.length > 0 ? (
            <>
              <h2 className="font-gowunBold text-[22px]">제품 후기</h2>
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
  );
}

export default ReviewList;
