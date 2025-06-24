// src/pages/CheckoutPage.jsx

import PurchaseButton from "@components/PurchaseButton";
import { useLocation } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const { cartItems, shippingCost } = location.state;
  console.log("🙇‍♀️ 넘어온 구매리스트: ", cartItems);

  const subtotal = cartItems?.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      {/* <Helmet>
        <title>다시, 봄 장바구니</title>
        <meta name="description" content="장바구니에 담긴 상품을 확인하세요." />
      </Helmet> */}

      {/* 제목 */}
      <h1 className="text-4xl font-bold mb-8">주문/결제</h1>

      {/* 주문 상품 테이블 */}
      <div className="border-t border-gray-300">
        {cartItems?.map((item) => (
          <div
            // 상품 아이디가 아닌, 주문건 아이디(상품아이디는 중복가능성 o, 고유해야 함)
            key={item._id}
            className="grid grid-cols-[auto_1fr_auto] gap-4 py-6 border-b border-gray-200"
          >
            <img
              src={`https://11.fesp.shop${item.product.image.path}`}
              className="w-[120px] h-[120px]"
            />
            <div>
              <p className="text-[1.8rem]">{item.product.name}</p>
              <p className="text-[1.4rem] text-gray-500 mt-4">
                수량: {item.quantity}개
              </p>
            </div>
            <p className="text-right text-[1.8rem] font-bold">
              {(item.product.price * item.quantity).toLocaleString()}원
            </p>
          </div>
        ))}
      </div>

      {/* 금액 요약 */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg space-y-3 text-[1.6rem]">
        <div className="flex justify-between">
          <span className="text-gray-600 mb-4">상품 금액</span>
          <span>{subtotal.toLocaleString()}원</span>
        </div>

        <div className="flex justify-between pb-3">
          <span className="text-gray-600">
            배송비
            <span className="ml-1 text-gray-400">(30,000원 이상 무료배송)</span>
          </span>
          <span>{shippingCost.toLocaleString()}원</span>
        </div>

        <div className="border-t border-gray-300 pt-6 flex justify-between text-[1.8rem] font-semibold">
          <span>총 결제 금액</span>
          <span className="text-primary-60 font-bold">
            {(subtotal + shippingCost).toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 결제 수단 버튼 */}
      <div className="mt-8 rounded-lg space-y-3 text-[1.6rem]">
        <h1 className="text-4xl font-bold mb-8 border-b border-gray-300 pb-8">
          결제수단 선택
        </h1>
        <div className="p-6 grid sm:grid-cols-2 gap-4 bg-gray-50">
          <PurchaseButton
            onClick={() => {
              /* 이니시스 카드 호출 */
            }}
            className="w-full py-3 rounded-md bg-primary-40 text-white hover:bg-primary-50 transition"
            products={cartItems}
            variant="inicis"
            pgCode="html5_inicis.INIpayTest"
            shippingCost={shippingCost}
          >
            카드결제 (이니시스)
          </PurchaseButton>

          <PurchaseButton
            onClick={() => {
              /* 카카오페이 호출 */
            }}
            className="w-full py-3 rounded-md bg-[#FEE500] text-[#181600] hover:brightness-90 transition"
            products={cartItems}
            variant="kakao"
            pgCode="kakaopay.TC0ONETIME"
            shippingCost={shippingCost}
          >
            카카오페이
          </PurchaseButton>

          <PurchaseButton
            onClick={() => {
              /* 네이버페이 호출 */
            }}
            className="w-full py-3 rounded-md bg-[#03C75A] text-white hover:brightness-90 transition"
            products={cartItems}
            variant="naver"
            pgCode="naverpay.NaverTest"
            shippingCost={shippingCost}
          >
            네이버페이
          </PurchaseButton>

          <PurchaseButton
            onClick={() => {
              /* 토스페이 호출 */
            }}
            className="w-full py-3 rounded-md bg-[#0064FF] text-white hover:brightness-90 transition"
            products={cartItems}
            variant="toss"
            pgCode="tosspay.tosstest"
            shippingCost={shippingCost}
          >
            토스페이
          </PurchaseButton>
        </div>
      </div>

      {/* 약관 동의 체크박스 (옵션) */}
      {/* <div className="mt-6 flex items-start space-x-2 text-sm">
        <input type="checkbox" id="agree" className="mt-1" />
        <label htmlFor="agree">
          주문 정보를 확인하였으며, 결제 진행에 동의합니다.
        </label>
      </div> */}
    </div>
  );
}
