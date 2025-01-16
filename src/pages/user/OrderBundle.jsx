import OrderItem from "@pages/user/OrderItem";

function OrderBundle() {
  return (
    <>
      <div className="flex flex-col rounded-[20px] p-[20px] shadow-[rgba(0,0,0,0.08)_0px_2px_4px_0px,_rgba(0,0,0,0.16)_0px_0px_1px_0px] shadow-red-600">
        <div className="flex justify-between items-center">
          <p className="text-[20px] font-gowunBold">2024.12.25 주문</p>
          <div className="flex items-center gap-[10px]">
            <p className="text-[18px] text-primary-70">주문 상세보기</p>
            <img className="w-[30px] h-[30px]" src="/icons/pointer.svg" />
          </div>
        </div>

        <OrderItem />
      </div>
    </>
  );
}
export default OrderBundle;
