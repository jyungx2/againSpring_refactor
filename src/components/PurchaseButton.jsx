import PropTypes from "prop-types";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useMutation } from "@tanstack/react-query";

const PurchaseButton = ({ products }) => {
  console.log("prop products: ", products);
  // const { loading, error, successMessage, placeOrder } = useOrderStore();

  // const handlePurchase = () => {
  //   placeOrder(products);
  // };
  const axios = useAxiosInstance();

  const handlePurchase = useMutation({
    mutationFn: async (orderProducts) => {
      const products = orderProducts.map((item) => ({
        _id: item.product_id,
        quantity: item.quantity,
      }));
      await axios.post("/orders", { products });
    },
    onSuccess: async () => {
      alert("주문이 완료되었습니다!");
    },
    onError: () => {
      alert("주문 처리 중 문제가 발생했습니다.");
    },
  });

  return (
    <div style={{ position: "relative" }}>
      <button
        className="bg-primary-40 text-white w-[280px] py-[8px] rounded-md text-[15px] text-center hover:bg-primary-50"
        onClick={() => handlePurchase.mutate(products)} // ✅ 여기서 넘긴 값이 위의 orderProducts로 들어감 & onSuccess 함수의 두번째 매개변수 값이기도 함
        disabled={handlePurchase.isLoading}
      >
        {handlePurchase.isLoading ? "구매 중..." : "구매하기"}
      </button>

      {/* {successMessage && (
        <div className="text-black font-gowunBold mt-[8px] text-[24px] absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] bg-primary-40 p-[40px] rounded-lg shadow-lg whitespace-nowrap">
          {successMessage}
        </div>
      )}

    
      {error && (
        <div className="text-red-500 mt-[8px] text-[14px] absolute">
          {error}
        </div>
      )} */}
    </div>
  );
};

PurchaseButton.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default PurchaseButton;
