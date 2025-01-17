import PropTypes from "prop-types";
import useOrderStore from "@store/purchaseStore";

const PurchaseButton = ({ products }) => {
  const { loading, error, successMessage, placeOrder } = useOrderStore();

  const handlePurchase = () => {
    placeOrder(products);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        className="bg-primary-40 text-white w-[280px] py-[8px] rounded-md text-[15px] text-center hover:bg-primary-50"
        onClick={handlePurchase}
        disabled={loading}
      >
        {loading ? "구매 중..." : "구매하기"}
      </button>

      {/* 성공 메시지 */}
      {successMessage && (
        <div className="text-black font-gowunBold mt-[8px] text-[24px] absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] bg-primary-40 p-[40px] rounded-lg shadow-lg whitespace-nowrap">
          {successMessage}
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="text-red-500 mt-[8px] text-[14px] absolute">
          {error}
        </div>
      )}
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
