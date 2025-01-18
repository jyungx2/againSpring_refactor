import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

ReviewItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    product: PropTypes.object.isRequired,
  }),
  count: PropTypes.number.isRequired,
};

function ReviewItem({ item, count }) {
  const navigate = useNavigate();
  return (
    <>
      <tr
        className="hover:bg-primary-5 hover:cursor-pointer"
        onClick={() => navigate(`/qna/detail/${item._id}`)}
      >
        <td className="border border-grey-30 text-center p-[8px]">{count}</td>
        <td className="border border-grey-30 text-center p-[8px]">
          <div className="flex items-start">
            <img
              src={`https://11.fesp.shop${item.product.image.path}`}
              className="w-[80px] h-[80px]"
            />
            {item.content}
          </div>
        </td>
        <td className="border border-grey-30 text-center p-[8px]">
          {item.createdAt.slice(0, 10)}
        </td>
      </tr>
    </>
  );
}

export default ReviewItem;
