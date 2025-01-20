import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TansoIntro = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("loading.."); // 로딩 텍스트 상태
  const [transitionComplete, setTransitionComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 로딩 애니메이션 지속 시간 (3초 후 전환 애니메이션 시작)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // `loading...` 텍스트 애니메이션
    const loadingInterval = setInterval(() => {
      setLoadingText((prev) =>
        prev === "loading.." ? "loading..." : "loading.." // 텍스트 변경 (loading.. <-> loading...)
      );
    }, 500); // 0.5초마다 변경

    return () => {
      clearTimeout(timer);
      clearInterval(loadingInterval); // 타이머와 인터벌 정리
    };
  }, []);

  const handleStart = () => {
    navigate("/tansomain"); // '시작하기' 버튼 클릭 시 tansomain 페이지로 이동
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
            {/* 로고 */}

            {/* 로딩 이미지 */}
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
            {/* 로딩 텍스트 */}
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

        {/* 색상 애니메이션 전환 */}
        {!isLoading && !transitionComplete && (
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
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1 }}
            />
            <motion.div
              className="absolute inset-0 bg-primary-90"
              initial={{ y: "300%" }}
              animate={{ y: "-100%" }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1, }}
              onAnimationComplete={() => setTransitionComplete(true)}
            />
          </>
        )}
      </AnimatePresence>

      {/* 메인 화면 */}
      {!isLoading && transitionComplete && (
        <motion.div
          className="absolute inset-0 flex items-center justify-start px-10 bg-gradient-to-b from-primary-90 to-primary-90 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div>
            <h1 className="text-5xl font-bold mb-6">
              다시,봄에서 상품을 구매하셨나요?
            </h1>
            <p className="mb-4 text-3xl">구매하신 상품의 탄소 발생량은 입니다!</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleStart}
              className="px-6 py-3 bg-primary-50 hover:bg-primary-70 rounded-lg text-xl"
            >
              자세히 보기
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TansoIntro;
