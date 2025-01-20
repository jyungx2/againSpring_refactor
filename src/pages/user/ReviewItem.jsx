import PropTypes from "prop-types";
import styles from "./User.module.css";

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

function ReviewItem({ item }) {
  return (
    <>
      <tr>
        <td className="border-y border-grey-10 text-center p-[8px]">
          <div className="flex gap-[10px] items-start">
            <div className="shrink-0">
              <img
                src={`https://11.fesp.shop${item.product.image.path}`}
                className="w-[80px] h-[80px]"
              />
            </div>

            <div className="flex flex-col h-[80px] items-start overflow-hidden gap-2">
              <div className="font-gowunBold text-[16px] ">
                {item.product.name}
              </div>
              <div className={`text-[14px] ${styles["clamp-text"]}`}>
                {item.content}
              </div>
              <div className="mt-auto font-gowunBold text-[14px]">
                {item.createdAt.slice(0, 10)}
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

export default ReviewItem;
