import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "@hooks/useAxiosInstance";

const TansoIntro = () => {
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [loadingText, setLoadingText] = useState("loading.."); // 로딩 텍스트 처음 상태
  const [transitionComplete, setTransitionComplete] = useState(false); // 첫 화면 전환 상태
  const [buttonTransition, setButtonTransition] = useState(false); // * 버튼 클릭 후 전환 상태
  const [totalTanso, setTotalTanso] = useState(0); // 총 탄소 배출량
  const [productNames, setProductNames] = useState([]); // 구매한 상품명 배열
  const navigate = useNavigate(); // 페이지 이동
  const axiosInstance = useAxiosInstance(); // Axios 인스턴스

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // 로딩 상태 변경
    }, 3000);

    const loadingInterval = setInterval(() => {
      setLoadingText((prev) =>
        prev === "loading.." ? "loading..." : "loading.." // 로딩 텍스트 변경
      );
    }, 500);

    // API 호출: 주문 데이터 가져오기
    axiosInstance
      .get("/orders")
      .then((response) => {
        const orders = response.data?.item || [];
        let tansoSum = 0;
        let names = [];

        // * 주문 데이터에서 상품명과 tanso 값 추출
        orders.forEach((order) => {
          if (order.products) {
            order.products.forEach((product) => {
              tansoSum += product.extra?.tanso || 0; // tanso 값 합산
              names.push(product.name); // 상품명 추가
            });
          }
        });

        setTotalTanso(tansoSum.toFixed(2)); // 총 탄소 배출량 설정
        setProductNames(names); // 구매한 상품명 설정
      })
      .catch((error) => {
        console.error("주문 데이터를 가져오는 데 실패했습니다:", error); // 오류 처리
      });

    return () => {
      clearTimeout(timer);
      clearInterval(loadingInterval);
    };
  }, []); // 의존성 배열 제거: 초기 로딩에만 실행

  const handleStart = () => {
    setButtonTransition(true); // tansomain페이지 이동 전 버튼 전환 애니메이션 시작
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence>
        {/* 로딩 화면 */}
        {isLoading && (
          <motion.div
            key="loading"
            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-primary-20 to-primary-20 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* 로딩 아이콘, 텍스트 */}
            <motion.img
              src="/favicon.png"
              alt=""
              className="w-24 h-24"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              }}
            />
            <motion.p
              className="mt-4 text-2xl font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {loadingText}
            </motion.p>
          </motion.div>
        )}

        {/* 화면 전환 애니메이션 */}
        {!isLoading && !transitionComplete && !buttonTransition && (
          <>
            <motion.div
              className="absolute inset-0 bg-primary-20"
              initial={{ y: 0 }}
              animate={{ y: "-100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0 bg-primary-50"
              initial={{ y: "100%" }}
              animate={{ y: "-100%" }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1 }}
            />
            <motion.div
              className="absolute inset-0 bg-primary-70"
              initial={{ y: "200%" }}
              animate={{ y: "-100%" }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              onAnimationComplete={() => setTransitionComplete(true)}
            />
          </>
        )}

        {/* 버튼 클릭 후 화면 전환 애니메이션 */}
        {buttonTransition && (
          <>
            <motion.div
              className="absolute inset-0 bg-primary-20"
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0 bg-primary-50"
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1 }}
            />
            <motion.div
              className="absolute inset-0 bg-primary-70"
              initial={{ x: "200%" }}
              animate={{ x: "-100%" }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              onAnimationComplete={() => navigate("/tansomain")} // * 애니메이션 완료 후 페이지 이동
            />
          </>
        )}
      </AnimatePresence>

      {/* 메인 화면 */}
      {!isLoading && transitionComplete && !buttonTransition && (
        <motion.div
          className="absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-b from-primary-90 to-primary-90 text-white px-8" // * 왼쪽 정렬
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl font-bold mb-6">다시,봄에서 친환경 상품을 구매하셨나요?</h1>
          <p className="mb-4 text-3xl">
            구매하신 상품{" "}
            <strong>{productNames.join(", ") || "없음"}</strong>의 탄소 발생량은{" "}
            <strong>{totalTanso} kg CO₂</strong> 입니다!
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleStart}
            className="px-6 py-3 bg-primary-50 hover:bg-primary-70 rounded-lg text-xl"
          >
            자세히 보기
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default TansoIntro;
