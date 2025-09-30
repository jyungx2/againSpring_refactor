import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@hooks/useAxiosInstance";

const QnAListItem = ({ item, number }) => {
  const ADMIN_EMAILS = ["admin@market.com", "seop96@naver.com"];

  const axios = useAxiosInstance();

  const { data: repliesData } = useQuery({
    queryKey: ["replies", item._id],
    queryFn: () => axios.get(`/posts/${item._id}/replies`),
    select: (res) => res.data,
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
  });

  const hasAdminReply = repliesData?.item?.some((reply) =>
    ADMIN_EMAILS.includes(reply.user?.email)
  );

  return (
    <tr className="border-b border-grey-10 hover:bg-grey-5">
      <td className="py-5 text-left pl-5">{number}</td>
      <td>
        <Link
          to={`/qna/detail/${item._id}`}
          className="flex items-center py-5 pl-5 gap-2"
        >
          {item.product && item.product.image && (
            <img
              src={item.product.image.path}
              alt={item.product.name}
              className="w-20 h-20 object-cover"
            />
          )}
          <div className="flex items-center gap-2">
            {item.title}
            <span
              className={`inline-block px-5 py-2 rounded-[20px] text-white text-sm ${
                hasAdminReply ? "bg-primary-40" : "bg-grey-20"
              }`}
            >
              {hasAdminReply ? "답변완료" : "답변대기"}
            </span>
          </div>
        </Link>
      </td>
      <td className="py-5 text-right pr-2.5">{item.user?.name}</td>
      <td className="py-5 text-right pr-5">{item.createdAt.split(" ")[0]}</td>
    </tr>
  );
};

export default QnAListItem;

QnAListItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    createdAt: PropTypes.string.isRequired,
    product_id: PropTypes.number,
    product: PropTypes.shape({
      image: PropTypes.shape({
        path: PropTypes.string.isRequired,
      }),
      name: PropTypes.string,
    }),
  }).isRequired,
  number: PropTypes.number.isRequired,
};
