import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TansoIntro = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transitionComplete, setTransitionComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 로딩 3초
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    navigate("/tansomain");
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence>
        {/* 로딩 화면 */}
        {isLoading && (
          <motion.div
            key="loading"
            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-primary-20 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* 로고 */}
            <motion.img
              src="/images/Logo.png"
              alt="로고"
              className="w-24 h-24 mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 1.5,
              }}
            />
            {/* 로딩 이미지 */}
            <motion.img
              src="/favicon.png"
              alt="로딩 중"
              className="w-16 h-16"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              }}
            />
          </motion.div>
        )}

        {/* 색상 전환 */}
        {!isLoading && !transitionComplete && (
          <>
            <motion.div
              className="absolute inset-0 bg-red-500"
              initial={{ y: 0 }}
              animate={{ y: "-100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0 bg-yellow-500"
              initial={{ y: "100%" }}
              animate={{ y: "-100%" }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.div
              className="absolute inset-0 bg-blue-500"
              initial={{ y: "200%" }}
              animate={{ y: "-100%" }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                delay: 0.4,
              }}
              onAnimationComplete={() => setTransitionComplete(true)}
            />
          </>
        )}
      </AnimatePresence>

      {/* 메인 화면 */}
      {!isLoading && transitionComplete && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-blue-800 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold mb-6">탄소 발자국 계산기</h1>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleStart}
            className="px-6 py-3 bg-primary-50 hover:bg-primary-70 rounded-lg text-xl"
          >
            시작하기
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default TansoIntro;
