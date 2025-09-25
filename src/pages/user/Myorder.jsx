import useAxiosInstance from "@hooks/useAxiosInstance";
import OrderBundle from "@pages/user/OrderBundle";
import Sidebar from "@pages/user/Sidebar";
import useUserStore from "@store/userStore";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

function MyOrder() {
  const axios = useAxiosInstance();
  const { user } = useUserStore();
  const { data } = useQuery({
    queryKey: ["orders"],
    queryFn: () => axios.get(`/orders`),
    select: (res) => {
      console.log(res.data);
      return res.data;
    },
  });
  console.log(user);

  const renderedOrderBundle = data?.item.map((bundle) => {
    return <OrderBundle key={bundle._id} bundle={bundle} />;
  });

  return (
    <>
      <Helmet>
        <title>다시, 봄 - 주문조회</title>
        <meta property="og:title" content="다시봄 주문조회" />
        <meta
          property="og:description"
          content="내 주문 내역을 확인하고, 배송 상태를 실시간으로 추적하세요."
        />
      </Helmet>

      <div className="flex box-border max-w-[1200px] mx-auto px-6">
        <Sidebar />

        <div className="flex-grow min-w-0 basis-0 flex flex-col gap-[40px]">
          <div className="flex items-center justify-center gap-[30px] box-border p-[30px] overflow-hidden  shadow-md">
            <div className="w-[700px] flex items-start gap-[20px]">
              {user.profile ? (
                <img
                  className="w-[100px] h-[100px] aspect-square object-cover border border-grey-20 rounded-full box-border p-1"
                  src={user.profile}
                  alt="프로필 이미지"
                />
              ) : (
                <img
                  className="w-[100px] aspect-square object-contain"
                  src="/icons/profile.svg"
                />
              )}
              <div className="flex flex-col">
                <p className="mb-10">{user.name}님, 안녕하세요.</p>
              </div>
            </div>

            <div className="flex gap-[20px]">
              <div className="flex flex-col items-center gap-[10px] box-border py-[40px] px-[60px] whitespace-nowrap flex-shrink-0">
                <h4>포인트</h4>
                <span className="font-gowunBold text-[26px]">0</span>
              </div>
              <div className="flex flex-col items-center gap-[10px] box-border py-[40px] px-[60px] whitespace-nowrap flex-shrink-0">
                <h4>쿠폰</h4>
                <span className="font-gowunBold text-[26px]">2</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-[20px] text-[26px]">
            <div>
              <h1 className="mb-8 font-gowunBold">주문 목록</h1>
            </div>
            <div className="flex flex-col gap-[50px] text-[26px] font-gowunBold">
              {renderedOrderBundle}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyOrder;
