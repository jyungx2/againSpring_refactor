import useUserStore from "@store/userStore";

function Myorder() {
  const { user } = useUserStore();
  console.log("Myorder - user 상태: ", user);

  return (
    <>
      <div className="flex box-border max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col gap-[24px] pt-[24px] min-w-[180px]">
          <a>주문조회</a>
          <a>1:1 문의</a>
          <a>위시리스트</a>
          <a>쿠폰</a>
          <a>포인트</a>
          <a>정보 수정</a>
          <a>회원탈퇴</a>
        </div>

        <div className="flex-grow min-w-0 basis-0 flex flex-col gap-[40px]">
          <div className="flex items-center justify-center gap-[30px] box-border p-[30px] overflow-hidden">
            <div className="w-[700px] flex items-start gap-[20px]">
              {user?.profile ? (
                <img
                  className="w-[100px] h-[100px] aspect-square object-cover border border-grey-20 rounded-full box-border p-1"
                  src={`https://11.fesp.shop${user.profile}`}
                  alt="프로필 이미지"
                />
              ) : (
                <img
                  className="w-[100px] aspect-square object-contain"
                  src="/icons/profile.svg"
                />
              )}
              <p>{user?.name}님, 안녕하세요.</p>
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

          <div className="flex flex-col gap-[20px] p-[20px] text-[26px] font-gowunBold">
            <div>
              <h1 className="order-list-header">주문 목록</h1>
            </div>

            <div className="flex flex-col rounded-[20px] p-[20px] shadow-[rgba(0,0,0,0.08)_0px_2px_4px_0px,_rgba(0,0,0,0.16)_0px_0px_1px_0px]">
              <div className="flex justify-between items-center">
                <p className="text-[20px] font-gowunBold">2024.12.25 주문</p>
                <div className="flex items-center gap-[10px]">
                  <p className="text-[18px] text-primary-70">주문 상세보기</p>
                  <img className="w-[30px] h-[30px]" src="/icons/pointer.svg" />
                </div>
              </div>

              <div className="mt-[30px] flex flex-col gap-[20px] text-[16px] border border-grey-10 rounded-[12px] p-[20px]">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Myorder;
