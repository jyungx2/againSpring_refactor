import "./jy-global.css";

function Myreview() {
  return (
    <>
      <div className="flex box-border min-w-[1200px] mx-auto px-6 pb-0">
        <div className="flex flex-col gap-[24px] pt-[24px] min-w-[180px]">
          <a>주문조회</a>
          <a>1:1 문의</a>
          <a>위시리스트</a>
          <a>쿠폰</a>
          <a>포인트</a>
          <a>정보 수정</a>
          <a>회원탈퇴</a>
        </div>

        <div className="flex-grow min-w-0 basis-0 flex flex-col gap-[20px]">
          <div className="flex items-start p-[30px] text-[16px] border-t-2 border-black gap-[18px]">
            <img src="src/pages/user/icons/basket.svg" />
            <div className="flex flex-col gap-[16px]">
              <h1 className="text-[26px] font-gowunBold">상품리뷰</h1>
              <p>상품의 품질에 대해서 얼마나 만족하시나요?</p>
            </div>
          </div>
          <div className="flex items-start p-[30px] text-[16px] border-t border-grey-30 gap-[18px]">
            <img src="src/pages/user/icons/image.png" />
            <div className="flex flex-col gap-[20px]">
              <p className="font-gowunBold">안티 헤어 로스 샴푸바</p>
              <p>12,900원 - 1개</p>
            </div>
          </div>
          <div className="flex items-start p-[30px] text-[16px] border-t border-grey-30 gap-[60px]">
            <h2 className="flex-shrink-0 font-gowunBold text-[20px]">
              상세리뷰
            </h2>
            <div className="flex-grow border border-grey-20 rounded-[2px] w-full">
              <textarea
                className="block w-full p-[10px] box-border text-[14px] placeholder:text-grey-40"
                rows="10"
                placeholder="다른 고객님에게 도움이 되도록 상품에 대한 솔직한 평가를 남겨주세요."
              ></textarea>
            </div>
          </div>
          <div className="flex items-start p-[30px] text-[16px] border-t border-grey-30 gap-[60px]">
            <h2 className="font-gowunBold text-[20px]">사진첨부</h2>
            <button className="font-gowunBold h-[42px] leading-[42px] text-primary-70 text-[16px] px-[24px] border-2 border-primary-30 rounded-[2px] box-border cursor-pointer">
              사진 첨부하기
            </button>
          </div>

          <div className="flex justify-center gap-[24px] border-t border-grey-30 p-[34px]">
            <button className="bg-grey-40 inline-block text-[16px] text-white h-[48px] leading-[48px] font-gowunBold box-border cursor-pointer rounded-[12px] px-[64px]">
              취소
            </button>
            <button className="bg-primary-40 inline-block text-[16px] text-white h-[48px] leading-[48px] font-gowunBold box-border cursor-pointer rounded-[12px] px-[64px]">
              등록
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Myreview;
