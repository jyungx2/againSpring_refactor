import OrderBundle from "@pages/user/OrderBundle";
import Sidebar from "@pages/user/Sidebar";
import useUserStore from "@store/userStore";

function Myorder() {
  const { user } = useUserStore();
  console.log(user._id);

  return (
    <>
      <div className="flex box-border max-w-[1200px] mx-auto px-6">
        <Sidebar />

        <div className="flex-grow min-w-0 basis-0 flex flex-col gap-[40px]">
          <div className="flex items-center justify-center gap-[30px] box-border p-[30px] overflow-hidden">
            <div className="w-[700px] flex items-start gap-[20px]">
              {user.profile ? (
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
              <p>{user.name}님, 안녕하세요.</p>
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

            <OrderBundle />
          </div>
        </div>
      </div>
    </>
  );
}

export default Myorder;
