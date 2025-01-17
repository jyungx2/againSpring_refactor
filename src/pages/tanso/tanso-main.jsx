import { useNavigate } from "react-router-dom";
import useUserStore from "@store/userStore";
import { useEffect } from "react";

const CarbonFootprint = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    console.log("현재 로그인된 사용자 정보:", user);
  }, []);

  if (!user) {
    return (
      <div className="p-5 text-center">
        <h2 className="text-xl font-bold">로그인된 사용자를 찾을 수 없습니다.</h2>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          로그인 하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold text-center">{user.name}님, 지금까지 발생한 탄소 발자국</h1>
      <div className="mt-5 mx-auto max-w-4xl p-4 border border-gray-300 rounded bg-gray-50 text-center">
        <p className="text-lg font-semibold text-gray-700">
          <strong>0 kg CO₂</strong>
        </p>
        <p className="mt-2 text-gray-600">
          탄소 발자국을 계산하여 얼마나 발생했는지 확인해보세요!
        </p>
      </div>
    </div>
  );
};

export default CarbonFootprint;
