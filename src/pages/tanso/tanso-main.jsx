import { useState, useEffect } from "react";
import useAxiosInstance from "@hooks/useAxiosInstance";
import useUserStore from "@store/userStore";

const TansoMain = () => {
  const user = useUserStore((store) => store.user); // 사용자 정보 상태

  // 총 탄소 배출량, 주문한 제품 데이터, 카테고리별 탄소 배출량
  const [totalTanso, setTotalTanso] = useState(0);
  const [products, setProducts] = useState([]);
  const [categoryTanso, setCategoryTanso] = useState({});
  const axiosInstance = useAxiosInstance();

  // 카테고리 이름 매핑
  const categoryLabels = {
    bathroom: "욕실용품",
    kitchen: "주방용품",
    laundry: "세탁용품",
    life: "생활잡화",
    stationery: "문구용품",
    food: "식품",
    pet: "반려동물",
  };

  // 이미지 경로 처리 함수
  const getImage = (path) => `https://11.fesp.shop${path}`; // 이미지 경로 반환


  useEffect(() => {
    // console.log("이름 호출:", product.name);
    // console.log("이미지 호출:", product.image);
    // console.log("이미지 경로:", imagePath);
    // 주문 데이터 호출: 탄소 배출량 계산
    axiosInstance
      .get("/orders")
      .then((response) => {
        const orders = response.data?.item || [];
        let tansoSum = 0; // 탄소 초기화
        const productList = []; // 제품 데이터 초기화
        const categoryData = Object.keys(categoryLabels).reduce(
          (acc, key) => ({ ...acc, [key]: 0 }),
          {}
        );

        orders.forEach((order) => {
          order.products.forEach((product) => {
            const tanso = product.extra?.tanso || 0; // 제품의 탄소 배출량
            const categories = product.extra?.category || []; // 제품 카테고리 배열
            const mainCategory = categories.find((cat) => cat !== "all-of-list"); // 메인 카테고리 추출

            tansoSum += tanso; // 총 탄소 배출량 계산

            const imagePath = product.image?.path || null; // 이미지 경로 추출
            const fullImagePath = getImage(imagePath);

            // 제품 리스트에 데이터 추가
            productList.push({
              id: product.id,
              name: product.name,
              tanso,
              image: fullImagePath,
              category: categoryLabels[mainCategory], // 카테고리 매핑
            });

            // 카테고리별 탄소 배출량 계산
            if (mainCategory && categoryLabels[mainCategory]) {
              categoryData[mainCategory] += tanso;
            }
          });
        });

        // console.log(productList);
        // console.log(categoryData);

        // 상태 업데이트
        setTotalTanso(tansoSum.toFixed(2)); // 총 탄소 배출량 설정
        setProducts(productList); // 제품 리스트 설정
        setCategoryTanso(categoryData); // 카테고리별 탄소 배출량 
      })
      .catch((error) => console.error("주문 데이터를 가져오는데 실패했습니다:", error));
  }, []);

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-10">
        {/* 상단 카드 */}
        <div className="bg-green-200 p-10 rounded-lg shadow-lg flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={user?.profile || "/icons/profile.svg"} // 사용자 프로필 이미지
              alt="User profile"
              className="w-20 h-20 rounded-full mr-8"
            />
            <div>
              <h1 className="text-2xl font-bold">{user?.name || "(로그인하세요)"}님이 주문하신 제품과 탄소량</h1>
              <p className="text-6xl font-extrabold text-green-800 mt-6">{totalTanso} kg CO2e</p>
            </div>
          </div>
        </div>

        {/* 차트 - 카테고리별 탄소 배출량 표시 */}
        <div className="bg-white p-8 rounded-lg shadow-lg mt-12">
          <h2 className="text-2xl font-bold mb-6">어디서 많이 배출할까요?</h2>
          <div className="space-y-4">
            {Object.entries(categoryTanso).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <span className="w-32 text-gray-700">{categoryLabels[key]}</span>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden mx-4">
                  <div
                    className="bg-blue-400 h-full"
                    style={{ width: `${Math.min(value, 100)}%` }} // 최대 100% 제한
                  ></div>
                </div>
                <span>{value.toFixed(2)} kg</span>
              </div>
            ))}
          </div>
        </div>

        {/* 주문한 제품 목록 표시 */}
        <div className="bg-white p-8 rounded-lg shadow-lg mt-12">
          <h2 className="text-2xl font-bold mb-6">주문한 제품 목록</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-4 border border-gray-200 rounded-lg shadow-md"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-gray-700 mt-2">
                  카테고리: {product.category}
                </p>
                <p className="text-gray-700 mt-2">
                  탄소 배출량: <span className="font-bold">{product.tanso} kg</span>
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TansoMain;
