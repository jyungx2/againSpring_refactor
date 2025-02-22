import { Link } from "react-router-dom";

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <img src="/images/ErrorImg.png" alt="에러 이미지" className="mb-4 w-64 h-64 object-contain" />

      <h1 className="text-6xl font-extrabold text-primary-50 mb-4">503</h1>
      <h2 className="text-6xl font-bold mb-4">다시,봄 페이지 서비스 점검 중</h2>
      <p className="text-2xl text-gray-700 mb-8 text-center max-w-2xl">
        현재 시스템 점검 및 업데이트가 진행 중입니다<br />종료 예정 시간 : 미정
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-secondary-10 text-white rounded hover:bg-secondary-30 transition-colors"
      >
        홈으로 이동
      </Link>
    </div>
  );
};

export default MaintenancePage;
