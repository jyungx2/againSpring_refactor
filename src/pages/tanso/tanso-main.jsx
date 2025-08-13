import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useAxiosInstance from "@hooks/useAxiosInstance";
import useUserStore from "@store/userStore";
import { Helmet } from "react-helmet-async";

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
  const getImage = (path) => `https://fesp-api.koyeb.app/market${path}`; // 이미지 경로 반환

  useEffect(() => {
    // 주문 데이터 호출 시작
    axiosInstance
      .get("/orders")
      .then((response) => {
        const orders = response.data?.item || []; // 응답 데이터에서 주문 리스트 추출 (없으면 빈 배열로 초기화)

        let tansoSum = 0; // 총 탄소 배출량 초기화
        const productList = []; // 제품 데이터 배열 초기화
        const categoryData = Object.keys(categoryLabels).reduce(
          (acc, key) => ({ ...acc, [key]: 0 }), // 카테고리별 탄소 배출량 초기화 (모든 카테고리 값 0)
          {}
        );

        // 주문 데이터 반복 처리 시작
        orders.forEach((order) => {
          order.products.forEach((product) => {
            const tanso = product.extra?.tanso || 0;
            const categories = product.extra?.category || [];
            const mainCategory = categories.find(
              (category) => category !== "all-of-list"
            ); // 'all-of-list' 제외한 주요 카테고리 추출

            tansoSum += tanso; // 총 탄소 배출량에 현재 제품의 탄소 배출량 추가

            // 이미지 경로 처리
            const imagePath = product.image?.path || null;
            const fullImagePath = getImage(imagePath);

            // 제품 정보 productList 추가
            productList.push({
              id: product.id,
              name: product.name,
              tanso,
              image: fullImagePath,
              category: categoryLabels[mainCategory],
            });

            // 카테고리에 탄소 배출량 추가
            if (mainCategory && categoryLabels[mainCategory]) {
              categoryData[mainCategory] += tanso; // 해당 카테고리에 탄소 배출량 누적
            }
          });
        });

        // 상태 업데이트
        setTotalTanso(tansoSum.toFixed(2)); // 소수점 2자리로 설정
        setProducts(productList); // 제품 데이터 상태에 저장
        setCategoryTanso(categoryData); // 카테고리별 탄소 배출량 상태에 저장
      })
      .catch((error) => {
        console.error("주문 데이터를 가져오는 데 실패했습니다:", error);
      });
  }, []); // 처음 렌더링될 때만 실행

  // 렌더링될 때 서서히 나타나는 효과 적용
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <>
      <Helmet>
        <title>다시, 봄 - 탄소 발자국 메인</title>
        <meta property="og:title" content="다시봄 탄소발자국 메인" />
        <meta
          property="og:description"
          content="제품을 구매하셨다면 탄소 발자국을 확인해보세요."
        />
      </Helmet>
      <div className="bg-gray-50 w-[1200px] mx-auto px-6 py-8 border border-gray-200 rounded-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-12">
          {/* 정보 섹션 */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-primary-20 p-20 rounded-lg shadow-lg my-16 border border-primary-30"
          >
            <h2 className="text-5xl font-extrabold mb-12 text-center text-primary-90">
              탄소 발자국이란?
            </h2>
            <p className="text-2xl text-primary-90 leading-relaxed">
              <span className="font-bold text-primary-80">탄소 발자국</span>은
              우리가 일상생활에서 사용하는 제품의{" "}
              <span className="bg-primary-40 px-3 py-1 rounded text-white">
                원료
              </span>
              ,{" "}
              <span className="bg-primary-40 px-3 py-1 rounded text-white">
                제조 과정
              </span>
              ,{" "}
              <span className="underline decoration-primary-80">
                사용 후 폐기
              </span>
              까지 모든 과정에서 발생하는{" "}
              <span className="font-bold text-primary-80">
                이산화탄소(CO₂) 배출량
              </span>
              을 수치로 나타낸 것입니다.
            </p>
            <p className="text-2xl text-primary-90 mt-8 leading-relaxed">
              예를 들어,{" "}
              <span className="font-bold text-primary-80">감자칩 포장지</span>의
              탄소발자국이{" "}
              <span className="font-bold text-primary-80">75g</span>이라고
              표시되어 있다면, 감자 재배에서부터 감자칩 생산에 이르는 과정에서
              평균적으로{" "}
              <span className="bg-primary-40 px-3 py-1 rounded text-white font-bold">
                75g의 이산화탄소
              </span>
              가 배출된다는 의미입니다.
            </p>
            <p className="text-2xl text-primary-90 mt-8 leading-relaxed">
              우리가 자주 사용하는{" "}
              <span className="font-bold text-primary-80">종이컵</span>의 경우,
              무게는 고작{" "}
              <span className="text-primary-80 font-extrabold">5g</span>에
              불과하지만,{" "}
              <span className="bg-primary-40 px-3 py-1 rounded text-white">
                탄소발자국
              </span>
              은 그 2배가 넘는{" "}
              <span className="text-primary-80 font-bold">11g</span>이나
              된답니다! 🌱
            </p>
          </motion.div>

          {/* 상단 카드 */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-primary-40 p-16 rounded-lg shadow-lg flex items-center justify-between border border-primary-50"
          >
            <div className="flex items-center">
              <img
                src={`https://fesp-api.koyeb.app/market${user.profile}`}
                alt=""
                className="w-32 h-32 rounded-full border-4 border-primary-60 mr-10"
              />
              <div>
                <h1 className="text-4xl font-bold text-white">
                  {user?.name || "(로그인하세요)"}님이 주문하신 제품과 탄소량
                </h1>
                <p className="text-7xl font-extrabold text-primary-10 mt-6">
                  {totalTanso} kg CO2e
                </p>
              </div>
            </div>
          </motion.div>

          {/* 차트 - 카테고리별 탄소 배출량 표시 */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-secondary-10 p-14 rounded-lg shadow-lg mt-16 border border-secondary-20"
          >
            <h2 className="text-4xl font-bold mb-8 text-center text-secondary-80">
              어디서 많이 배출할까요?
            </h2>
            <div className="space-y-8">
              {Object.entries(categoryTanso).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <span className="w-48 text-xl text-secondary-80">
                    {categoryLabels[key]}
                  </span>
                  <div className="flex-1 h-8 bg-secondary-5 rounded-full overflow-hidden mx-8">
                    <div
                      className="bg-secondary-40 h-full"
                      style={{ width: `${Math.min(value, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xl text-secondary-70">
                    {value.toFixed(2)} kg
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 주문한 제품 목록 표시 */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-grey-5 p-12 rounded-lg shadow-lg mt-16 border border-grey-30"
          >
            <h2 className="text-4xl font-bold mb-8 text-center text-grey-70">
              주문한 제품 목록
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-8 border border-grey-20 rounded-lg shadow-md bg-white"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-cover rounded-md mb-6"
                  />
                  <h3 className="text-2xl font-bold text-grey-80">
                    {product.name}
                  </h3>
                  <p className="text-xl text-grey-70 mt-4">
                    카테고리: {product.category}
                  </p>
                  <p className="text-xl text-grey-70 mt-4">
                    탄소 배출량:{" "}
                    <span className="font-bold text-primary-70">
                      {product.tanso} kg
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TansoMain;
