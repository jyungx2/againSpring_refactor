import { useNavigate } from "react-router-dom";

// /pages/PurchaseComplete.jsx
export default function PurchaseComplete() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center -translate-y-40 h-screen">
      <div className="text-[64px] mb-4">🎉</div>
      <h1 className="text-[24px] font-bold">구매가 완료되었습니다!</h1>
      <p className="text-[16px] text-gray-600 mt-6">
        소중한 구매 감사합니다 😊
      </p>

      <button
        className="bg-primary-40 text-white w-[280px] p-[2rem] rounded-md text-[2rem] text-center  font-bold hover:bg-primary-50 mt-10"
        onClick={() => navigate("/user/order")}
      >
        주문내역 보러가기
      </button>
    </div>
  );
}
