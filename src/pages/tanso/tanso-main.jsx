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
    axiosInstance
      .get("/orders")
      .then((response) => {
        const orders = response.data?.item || [];
        let tansoSum = 0;
        const productList = [];
        const categoryData = Object.keys(categoryLabels).reduce(
          (acc, key) => ({ ...acc, [key]: 0 }),
          {}
        );

        orders.forEach((order) => {
          order.products.forEach((product) => {
            const tanso = product.extra?.tanso || 0;
            const categories = product.extra?.category || [];
            const mainCategory = categories.find((cat) => cat !== "all-of-list");

            tansoSum += tanso;

            const imagePath = product.image?.path || null;
            const fullImagePath = getImage(imagePath);

            productList.push({
              id: product.id,
              name: product.name,
              tanso,
              image: fullImagePath,
              category: categoryLabels[mainCategory],
            });

            if (mainCategory && categoryLabels[mainCategory]) {
              categoryData[mainCategory] += tanso;
            }
          });
        });

        setTotalTanso(tansoSum.toFixed(2));
        setProducts(productList);
        setCategoryTanso(categoryData);
      })
      .catch((error) => console.error("주문 데이터를 가져오는 데 실패했습니다:", error));
  }, []);

  return (
    <div className="bg-gray-50 w-[1200px] mx-auto px-6 py-8 border border-gray-200 rounded-lg shadow-lg">
      <div className="max-w-6xl mx-auto px-8">
        {/* 정보 섹션 */}
        <div className="bg-primary-20 p-16 rounded-lg shadow-lg my-16 border border-primary-30">
          <h2 className="text-4xl font-extrabold mb-10 text-center text-primary-90">
            탄소 발자국이란?
          </h2>
          <p className="text-xl text-primary-90 leading-relaxed">
            <span className="font-bold text-primary-80">탄소 발자국</span>
            은 우리가 일상생활에서 사용하는 제품의{" "}
            <span className="bg-primary-40 px-2 rounded text-white">원료</span>,{" "}
            <span className="bg-primary-40 px-2 rounded text-white">제조 과정</span>,{" "}
            <span className="underline decoration-primary-80">사용 후 폐기</span>까지 모든 과정에서 발생하는{" "}
            <span className="font-bold text-primary-80">이산화탄소(CO₂) 배출량</span>을 수치로 나타낸 것입니다.
          </p>
          <p className="text-xl text-primary-90 mt-8 leading-relaxed">
            예를 들어, <span className="font-bold text-primary-80">감자칩 포장지</span>의 탄소발자국이{" "}
            <span className="font-bold text-primary-80">75g</span>이라고 표시되어 있다면, 감자 재배에서부터 감자칩
            생산에 이르는 과정에서 평균적으로{" "}
            <span className="bg-primary-40 px-2 rounded text-white font-bold">75g의 이산화탄소</span>
            가 배출된다는 의미입니다.
          </p>
          <p className="text-xl text-primary-90 mt-8 leading-relaxed">
            우리가 자주 사용하는 <span className="font-bold text-primary-80">종이컵</span>의 경우, 무게는 고작{" "}
            <span className="text-primary-80 font-extrabold">5g</span>에 불과하지만,{" "}
            <span className="bg-primary-40 px-2 rounded text-white">탄소발자국</span>
            은 그 2배가 넘는 <span className="text-primary-80 font-bold">11g</span>이나 된답니다! 🌱
          </p>
        </div>


        {/* 상단 카드 */}
        <div className="bg-primary-40 p-12 rounded-lg shadow-lg flex items-center justify-between border border-primary-50">
          <div className="flex items-center">
            <img
              src={user?.profile || "/icons/profile.svg"}
              alt="User profile"
              className="w-24 h-24 rounded-full border-4 border-primary-60 mr-8"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">
                {user?.name || "(로그인하세요)"}님이 주문하신 제품과 탄소량
              </h1>
              <p className="text-6xl font-extrabold text-primary-10 mt-6">{totalTanso} kg CO2e</p>
            </div>
          </div>
        </div>

        {/* 차트 - 카테고리별 탄소 배출량 표시 */}
        <div className="bg-secondary-10 p-10 rounded-lg shadow-lg mt-12 border border-secondary-20">
          <h2 className="text-3xl font-bold mb-6 text-center text-secondary-80">어디서 많이 배출할까요?</h2>
          <div className="space-y-6">
            {Object.entries(categoryTanso).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <span className="w-40 text-lg text-secondary-80">{categoryLabels[key]}</span>
                <div className="flex-1 h-6 bg-secondary-5 rounded-full overflow-hidden mx-6">
                  <div
                    className="bg-secondary-40 h-full"
                    style={{ width: `${Math.min(value, 100)}%` }}
                  ></div>
                </div>
                <span className="text-lg text-secondary-70">{value.toFixed(2)} kg</span>
              </div>
            ))}
          </div>
        </div>

        {/* 주문한 제품 목록 표시 */}
        <div className="bg-grey-5 p-10 rounded-lg shadow-lg mt-12 border border-grey-30">
          <h2 className="text-3xl font-bold mb-6 text-center text-grey-70">주문한 제품 목록</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-6 border border-grey-20 rounded-lg shadow-md bg-white"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-bold text-grey-80">{product.name}</h3>
                <p className="text-lg text-grey-70 mt-2">
                  카테고리: {product.category}
                </p>
                <p className="text-lg text-grey-70 mt-2">
                  탄소 배출량: <span className="font-bold text-primary-70">{product.tanso} kg</span>
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
