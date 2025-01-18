import Sidebar from "@pages/user/Sidebar";
import { useLocation } from "react-router-dom";

function OrderDetail() {
  const location = useLocation();
  const bundle = location.state.bundle;
  const products = location.state.products;

  const renderedItem = products.map((item) => {
    return (
      <div
        key={item._id}
        className="mt-[30px] flex text-[16px] border border-grey-20 rounded-[12px] "
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

        <div className="flex flex-col justify-center gap-[12px] w-[240px] px-[30px] border-l border-grey-20">
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
            onClick={() => navigate("/review", { state: { bundle, item } })}
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
          <div id="1" className="flex flex-col gap-1">
            <div>
              <h1 className="mb-4 font-gowunBold text-[20px]">주문상세</h1>
              <p className="text-[14px]">
                <span className="font-gowunBold">2025.1.14 주문</span> 주문번호
                xxxxxxxx
              </p>
            </div>
            <div>{renderedItem}</div>
          </div>

          <div id="2">
            <h2 className="mb-6 font-gowunBold">받는 사람 정보</h2>
            <div className="flex flex-col border-t-2 border-black ">
              <table className="w-full border-collapse my-[20px]">
                <thead className="bg-grey-5 font-gowunBold">
                  <tr>
                    <th className="border border-grey-30 text-center p-[8px]">
                      번호
                    </th>
                    <th className="border border-grey-30 text-center p-[8px]">
                      제목
                    </th>
                    <th className="border border-grey-30 text-center p-[8px]">
                      작성일
                    </th>
                    <th className="border border-grey-30 text-center p-[8px]">
                      작성자
                    </th>
                    <th className="border border-grey-30 text-center p-[8px]">
                      조회수
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="hover:bg-primary-5 hover:cursor-pointer">
                    <td className="border border-grey-30 text-center p-[8px]">
                      1
                    </td>
                    <td className="border border-grey-30 text-center p-[8px]">
                      배송은 보통 며칠 걸리나요?
                    </td>
                    <td className="border border-grey-30 text-center p-[8px]">
                      2024-12-02
                    </td>
                    <td className="border border-grey-30 text-center p-[8px]">
                      국연수
                    </td>
                    <td className="border border-grey-30 text-center p-[8px]">
                      2
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="3">
            <h2>결제 정보</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetail;
