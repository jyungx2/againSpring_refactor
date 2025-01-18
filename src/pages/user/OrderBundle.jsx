import OrderItem from "@pages/user/OrderItem";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

OrderBundle.propTypes = {
  bundle: PropTypes.shape({
    _id: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    products: PropTypes.array,
  }),
};

function OrderBundle({ bundle }) {
  const navigate = useNavigate();
  const simpleDate = bundle.createdAt.slice(0, 10);

  const handleDetail = () => {
    navigate(`detail/${bundle._id}`, {
      state: { bundle: bundle, products: bundle.products },
    });
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="flex flex-col rounded-[20px] p-[20px] shadow-[rgba(0,0,0,0.08)_0px_2px_4px_0px,_rgba(0,0,0,0.16)_0px_0px_1px_0px]">
        <div className="flex justify-between items-center">
          <p className="text-[22px] font-gowunBold">{simpleDate} 주문</p>
          <div
            className="flex items-center gap-[10px] cursor-pointer"
            onClick={handleDetail}
          >
            <p className="text-[18px] text-primary-70">주문 상세보기</p>
            <img className="w-[24px] h-[24px]" src="/icons/pointer.svg" />
          </div>
        </div>

        <OrderItem bundle={bundle} products={bundle.products} />
      </div>
    </>
  );
}
export default OrderBundle;
