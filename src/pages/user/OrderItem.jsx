function OrderItem() {
  return (
    <>
      <div className="mt-[30px] flex flex-col gap-[20px] text-[16px] border border-grey-10 rounded-[12px] p-[20px] bg-red-200">
        <div className="flex justify-between">
          <div className="text-[20px] font-gowunBold">
            주문완료
            <span className="text-[18px] text-secondary-50 font-gowunBold">
              {" "}
              · 12/30 (목) 도착
            </span>
          </div>
          <img src="/icons/dots.svg" />
        </div>

        <div className="flex gap-[20px]">
          <img src="/icons/image.png" />
          <div className="flex flex-col justify-center gap-[20px]">
            <p>안티 헤어 로스 샴푸바</p>
            <p>12,900원 · 1개</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderItem;
