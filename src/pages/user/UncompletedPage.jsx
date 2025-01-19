import Sidebar from "@pages/user/Sidebar";

function UncompletedPage() {
  return (
    <>
      <div className="flex box-border max-w-[1200px] mx-auto px-6">
        <Sidebar />
        <div className="flex grow basis-0 min-w-0 justify-center items-center">
          ⏰ 준비중입니다...
        </div>
      </div>
    </>
  );
}

export default UncompletedPage;
