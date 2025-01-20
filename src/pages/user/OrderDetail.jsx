import useAxiosInstance from "@hooks/useAxiosInstance";
import Sidebar from "@pages/user/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import useUserStore from "@store/userStore";

function OrderDetail() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const bundle = location.state.bundle;
  const products = location.state.products;
  const axios = useAxiosInstance();

  const { data } = useQuery({
    queryKey: [],
    queryFn: () => axios.get(`/orders/${bundle._id}`),
    select: (res) => {
      console.log(res.data);
      return res.data;
    },
  });

  function createRandomNumber() {
    const number = Math.floor(Math.random() * Math.pow(10, 15));
    return String(number).padStart(15, "0"); // 10자리가 안되면 앞에 0을 추가
  }

  const randomNum = createRandomNumber();

  function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) {
      return ""; // phoneNumber가 없으면 빈 문자열 반환
    }

    if (phoneNumber) {
      // 11자리 번호 처리 (010으로 시작하는 번호)
      if (phoneNumber?.length === 11 && phoneNumber?.startsWith("010")) {
        return phoneNumber.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");
      }
      // 10자리 번호 처리 (02로 시작하는 번호)
      else if (phoneNumber?.length === 10 && phoneNumber?.startsWith("02")) {
        return phoneNumber.replace(/^(\d{2})(\d{4})(\d{4})$/, "$1-$2-$3");
      } else {
        throw new Error("유효한 전화번호가 아닙니다.");
      }
    }
  }

  const renderedItem = products.map((item) => {
    return (
      <div
        key={item._id}
        className="mt-[30px] mb-[20px] flex text-[16px] border border-grey-20 rounded-[12px] "
      >
        <div className="flex flex-col flex-grow justify-center p-[20px]">
          <div className="flex justify-between">
            <div className="text-[20px] font-gowunBold">
              주문완료
              <span className="text-[18px] text-secondary-50 font-gowunBold">
                {" "}
                · 1/25 (토) 도착
              </span>
            </div>
            <img src={"/icons/dots.svg"} />
          </div>
          <div className="flex gap-[20px]">
            <img
              className="w-[150px] h-[200px] object-contain"
              src={`https://11.fesp.shop${item.image?.path}`}
            />
            <div className="flex flex-col justify-center gap-[20px]">
              <p className="text-[18px]">{item.name}</p>
              <p className="text-[18px]">
                {item.price.toLocaleString()}원 · {item.quantity}개
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-[12px] w-[240px] px-[30px] border-l border-grey-20 font-gowunBold">
          <button
            type="button"
            className="text-[16px] border border-grey-20 h-[46px] rounded-lg"
          >
            배송 조회
          </button>
          <button
            type="button"
            className="text-[16px] border border-grey-20 h-[46px] rounded-lg"
          >
            교환, 반품 신청
          </button>
          <button
            type="button"
            className="text-[16px] text-primary-60 border border-primary-60 h-[46px] rounded-lg"
            onClick={() =>
              navigate(`/user/order/${bundle._id}/review/${item._id}`, {
                state: { bundle, item },
              })
            }
          >
            리뷰 작성하기
          </button>
        </div>
      </div>
    );
  });

  return (
    <>
      <div className="flex box-border max-w-[1200px] mx-auto px-6">
        <Sidebar />

        <div className="flex-grow min-w-0 basis-0 flex flex-col gap-[40px]">
          <div id="1" className="flex flex-col pt-10">
            <div>
              <h1 className="mb-4 font-gowunBold text-[22px]">주문상세</h1>
              <div className="text-[16px] flex items-center">
                <span className="font-gowunBold pr-6">
                  {data?.item.createdAt.slice(0, 10)}
                </span>
                <span className="text-[14px]">주문번호 {randomNum}</span>
              </div>
            </div>
            <div>{renderedItem}</div>
          </div>

          <div className="flex flex-col">
            <h2 className="mb-6 font-gowunBold text-[18px]">받는 사람 정보</h2>
            <div className="flex flex-col border-t-2 border-black ">
              <table className="w-full border-collapse my-[20px]">
                <tbody>
                  <tr>
                    <td className="p-[8px] w-[12.5%]">받는사람</td>
                    <td className="p-[8px]">{user.name}</td>
                  </tr>
                  <tr>
                    <td className="p-[8px] w-[12.5%]">연락처</td>
                    <td className="p-[8px]">
                      {formatPhoneNumber(user.phoneNumber)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-[8px] w-[12.5%]">받는주소</td>
                    <td className="p-[8px]">
                      {user.address || data?.item.address.value || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-[8px] w-[12.5%]">배송요청사항</td>
                    <td className="p-[8px]">문 앞</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="mb-6 font-gowunBold text-[18px]">결제정보</h2>
            <div className="flex flex-col gap-6 border-t-2 border-black pt-6">
              <div className="flex flex-col gap-2 border-b border-grey-30 pb-6">
                <span>결제수단</span>
                <p className="text-[16px] font-gowunBold">
                  MS 멋사카드 / 3 개월
                </p>
              </div>
              <div className="flex flex-col border-b border-grey-30 pb-6">
                <table>
                  <tbody>
                    <tr className="flex justify-between">
                      <td className="p-[8px] w-[12.5%]">총 상품가격</td>
                      <td className="p-[8px] font-gowunBold">
                        {data?.item.cost.products.toLocaleString()}원
                      </td>
                    </tr>
                    <tr className="flex justify-between">
                      <td className="p-[8px] w-[12.5%]">배송비</td>
                      <td className="p-[8px] font-gowunBold">
                        {data?.item.cost.shippingFees.toLocaleString()}원
                      </td>
                    </tr>
                    <tr className="flex justify-between">
                      <td className="p-[8px] w-[12.5%] text-[20px]">
                        총 결제금액
                      </td>
                      <td className="p-[8px] font-gowunBold text-[20px]">
                        {data?.item.cost.total.toLocaleString()}원
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetail;
