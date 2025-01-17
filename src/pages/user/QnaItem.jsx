import PropTypes from "prop-types";

QnaItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    views: PropTypes.number.isRequired,
  }),
};

function QnaItem({ item }) {
  return (
    <>
      <tr className="hover:bg-primary-5 hover:cursor-pointer">
        <td className="border border-grey-30 text-center p-[8px]">1</td>
        <td className="border border-grey-30 text-center p-[8px]">
          {item.title}
        </td>
        <td className="border border-grey-30 text-center p-[8px]">
          {item.createdAt.slice(0, 10)}
        </td>
        <td className="border border-grey-30 text-center p-[8px]">
          {item.user.name}
        </td>
        <td className="border border-grey-30 text-center p-[8px]">
          {item.views}
        </td>
      </tr>
    </>
  );
}

export default QnaItem;
