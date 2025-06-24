import PropTypes from "prop-types";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUserStore from "@store/userStore";

const COLOR_MAP = {
  inicis: "bg-primary-40 text-white hover:bg-primary-50",
  kakao: "bg-[#FEE500] text-[#181600] hover:brightness-90",
  naver: "bg-[#03C75A] text-white hover:brightness-90",
  toss: "bg-[#0064FF] text-white hover:brightness-90",
};

const PurchaseButton = ({
  children,
  pgCode,
  shippingCost,
  products,
  variant,
}) => {
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  console.log("products: ", products);
  const { user } = useUserStore();

  const totalAmount = products.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    shippingCost
  );

  const handlePurchase = useMutation({
    mutationFn: async (orderProducts) => {
      const products = orderProducts.products.map((item) => ({
        _id: item.productId,
        quantity: item.quantity,
      }));
      await axios.post("/orders", { products });
    },
    onSuccess: async () => {
      toast.success(`${user.name} 님, 주문이 완료되었습니다.`);
    },
    onError: (err) => {
      console.error(err);
      alert("주문 처리 중 문제가 발생했습니다.");
    },
  });

  const handlePayment = (pgCode) => {
    /* (1) Next.js 아니므로 CSR 환경 체크 */
    if (typeof window === "undefined") return;

    /* (2) 아임포트 SDK 접근 */
    const IMP = window.IMP;
    if (!IMP) {
      alert("결제 모듈이 아직 로드되지 않았습니다.");
      return;
    }

    /* (3) 가맹점 식별코드(init) */
    IMP.init("imp21154527"); // 테스트용 가맹점 코드

    /* (4) 고유 주문번호 생성 */
    const merchant_uid = "order_" + new Date().getTime();
    // `order_${Date.now()}`;

    /* (5) 결제창 파라미터 + 콜백             */
    IMP.request_pay(
      {
        pg: pgCode, // PG사 코드
        pay_method: "card",
        merchant_uid,
        name: products.map((item) => item.product.name).join(" "),
        amount: totalAmount,
        buyer_email: "test@example.com",
        buyer_name: "홍길동",
        buyer_tel: "010-1234-5678",
        buyer_addr: "서울시 강남구",
        buyer_postcode: "12345",
      },
      /* (6) 콜백 – 성공 시 DB 저장 후 페이지 이동 */
      async function (rsp) {
        if (rsp.success) {
          const orderData = {
            imp_uid: rsp.imp_uid,
            merchant_uid: rsp.merchant_uid,
            products: products.map((item) => ({
              productId: item.product._id,
              quantity: item.quantity,
            })),
            amount: rsp.paid_amount,
          };

          try {
            await handlePurchase.mutateAsync(orderData);

            // 구매 완료 페이지로 부드럽게 이동
            setTimeout(() => {
              navigate("/purchase-complete");
            }, 1500); // 약간의 감성 delay
          } catch (err) {
            console.error(err);
            alert("서버 요청 실패");
          }
        } else {
          // ✅ 결제 실패 시 에러코드 & 메시지 출력
          console.error("결제 실패 코드:", rsp.error_code);
          console.error("결제 실패 메시지:", rsp.error_msg);
          alert(`결제 실패: ${rsp.error_msg}`);
        }
      }
    );
  };

  return (
    <div className="relative flex justify-center items-center">
      <button
        className={`${COLOR_MAP[variant]} w-[280px] min-h-[48px] rounded-md p-3 text-[1.8rem] text-center font-black flex justify-center items-center leading-tight
`}
        onClick={() => handlePayment(pgCode)} // ✅ 여기서 넘긴 값이 위의 orderProducts로 들어감 & onSuccess 함수의 두번째 매개변수 값이기도 함
        disabled={handlePurchase.isLoading}
      >
        {handlePurchase.isLoading ? "결제 중..." : children}
      </button>

      {/* {successMessage && (
        <div className="text-black font-gowunBold mt-[8px] text-[24px] absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] bg-primary-40 p-[40px] rounded-lg shadow-lg whitespace-nowrap">
          {successMessage}
        </div>
      )}

    
      {error && (
        <div className="text-red-500 mt-[8px] text-[14px] absolute">
          {error}
        </div>
      )} */}
    </div>
  );
};

PurchaseButton.propTypes = {
  children: PropTypes.node.isRequired, // ✅ 버튼 안 텍스트
  pgCode: PropTypes.string.isRequired,
  shippingCost: PropTypes.number.isRequired,
  variant: PropTypes.string.isRequired,

  products: PropTypes.arrayOf(
    PropTypes.shape({
      product: PropTypes.shape({
        _id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
      }).isRequired,
      quantity: PropTypes.number.isRequired,
      _id: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default PurchaseButton;
