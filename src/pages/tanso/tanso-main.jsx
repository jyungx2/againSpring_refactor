import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useUserStore from "@store/userStore";

const CarbonFootprint = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="p-5 text-center"
      >
        <h2 className="text-2xl font-bold">
          탄소 발자국은 다시,봄 회원님만 사용 가능합니다.
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          로그인 하러 가기
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-5"
    >
      <h1 className="text-xl font-bold text-center">
        {user.name}님, 지금까지 발생한 탄소 발자국
      </h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="mt-5 mx-auto max-w-4xl p-4 border border-gray-300 rounded bg-gray-50 text-center"
      >
        <p className="text-lg font-semibold text-gray-700">
          <strong>0 kg CO₂</strong>
        </p>
        <p className="mt-2 text-gray-600">
          탄소 발자국을 계산하여 얼마나 발생했는지 확인해보세요!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default CarbonFootprint;
