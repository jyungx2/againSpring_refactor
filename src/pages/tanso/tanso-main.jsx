import { useState, useEffect } from "react";
import useAxiosInstance from "@hooks/useAxiosInstance";
import useUserStore from "@store/userStore";

const TansoMain = () => {
  const user = useUserStore((store) => store.user); // user 객체를 직접 가져옴
  const [totalTanso, setTotalTanso] = useState(0); // 총 탄소 배출량 상태
  const axiosInstance = useAxiosInstance(); // Axios 인스턴스

  useEffect(() => {
    // 디버깅
    // console.log("이름 호출:", user?.name);
    // console.log("이미지 호출:", user?.profile);
    // console.log(useUserStore.getState());

    // 주문 데이터 호출: 탄소 배출량 계산
    axiosInstance
      .get("/orders")
      .then((response) => {
        const orders = response.data?.item || [];
        let tansoSum = 0;

        // 주문 데이터에서 tanso 값 합산
        orders.forEach((order) => {
          if (order.products) {
            order.products.forEach((product) => {
              tansoSum += product.extra?.tanso || 0;
            });
          }
        });

        setTotalTanso(tansoSum.toFixed(2));
      })
      .catch((error) => {
        console.error("주문 데이터를 가져오는 데 실패했습니다:", error);
      });
  }, []);

  const categories = [
    "주방용품",
    "세탁용품",
    "욕실용품",
    "문구용품",
    "식품",
    "생활잡화",
    "반려동물",
  ];

  const graphData = [
    { label: "주방용품", value: 0, color: "bg-blue-300" },
    { label: "세탁용품", value: 0, color: "bg-blue-200" },
    { label: "욕실용품", value: 0, color: "bg-blue-100" },
    { label: "문구용품", value: 0, color: "bg-green-200" },
    { label: "식품", value: 0, color: "bg-yellow-200" },
    { label: "생활잡화", value: 0, color: "bg-orange-300" },
    { label: "반려동물", value: 0, color: "bg-green-300" },
  ];

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-10">
        {/* 상단 카드 */}
        <div className="bg-green-200 p-10 rounded-lg shadow-lg flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={user?.profile || "/icons/profile.svg"}
              alt="User profile"
              className="w-20 h-20 rounded-full mr-8"
            />
            <div>
              <h1 className="text-2xl font-bold">{user?.name || "사용자"}님이 구매한 상품의 탄소배출량</h1>
              <p className="text-6xl font-extrabold text-green-800 mt-6">{totalTanso} kg CO2e</p>
            </div>
          </div>
          <div className="bg-white text-green-800 font-medium px-6 py-3 rounded-full shadow-md text-lg">
            1008명 중 1008번째로 많아요
          </div>
        </div>

        {/* 차트 섹션 */}
        <div className="bg-white p-10 rounded-lg shadow-lg mt-12">
          <h2 className="text-2xl font-bold mb-8">어디서 많이 배출할까요?</h2>
          <div className="flex space-x-6 overflow-x-auto pb-6 mb-8">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-6 py-3 border border-gray-300 rounded-full text-lg font-medium ${index === 0 ? "bg-black text-white" : "bg-white text-gray-700"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="space-y-6">
            {graphData.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="w-1/4 text-lg font-medium text-gray-700">{item.label}</span>
                <div className="w-3/4">
                  <div
                    className={`h-10 ${item.color} rounded-md`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
                <span className="ml-6 text-lg font-semibold text-gray-700">{item.value} kg</span>
              </div>
            ))}
          </div>
        </div>

        {/* 추가 정보 섹션 */}
        <div className="bg-yellow-100 p-10 rounded-lg shadow-lg my-12">
          <h2 className="text-2xl font-bold mb-8">일상 탄소저감 실천 팁</h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            개인의 탄소배출량을 줄이는 가장 효과적인 방법은 대중교통을 이용하고, 재활용 가능한 제품을 선택하는 것입니다.
          </p>
        </div>

        {/* 추천 제품 섹션 */}
        <div className="bg-white p-10 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-8">일상 탄소저감 소비 팁</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <img
                src=""
                alt="상품1"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <p className="text-lg text-gray-700">상품1</p>
            </div>
            <div className="text-center">
              <img
                src=""
                alt="상품2"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <p className="text-lg text-gray-700">상품2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TansoMain;
