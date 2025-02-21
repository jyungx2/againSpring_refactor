import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <img src="public/images/ErrorImg.png" alt="에러 이미지" className="mb-4 w-64 h-64 object-contain" />

      <h1 className="text-6xl font-extrabold text-primary-50 mb-4">404</h1>
      <h2 className="text-6xl font-bold mb-6">잘못된 페이지 접근</h2>
      <p className="text-2xl text-gray-700 mb-8 text-center max-w-md">
        접근하신 주소의 페이지는 사라졌거나 <br />다른 페이지로 변경되었습니다. <br />
        주소를 다시 확인해주세요.
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

export default NotFound;
