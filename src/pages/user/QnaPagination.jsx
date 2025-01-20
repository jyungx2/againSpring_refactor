import PropTypes from "prop-types";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

QnaPagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

function QnaPagination({ totalPages, currentPage = 1, onPageChange }) {
  console.log(totalPages, currentPage);
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const setNewPage = (newPage) => {
    searchParams.set("page", newPage);
    const search = searchParams.toString();

    // 페이지 변경 함수 호출
    onPageChange(newPage);

    // URL 업데이트
    navigate(`/user/${type}?${search}`);
  };

  return (
    <>
      <div className="flex gap-[48px] items-center justify-center mt-[40px]">
        {currentPage === 1 ? (
          <button disabled>
            <img src="/icons/arrow-left.svg" />
          </button>
        ) : (
          <button onClick={() => setNewPage(currentPage - 1)}>
            <img src="/icons/arrow-left-active.svg" />
          </button>
        )}

        <div className="flex gap-[6px]">
          {currentPage} / {totalPages}
        </div>

        {currentPage === totalPages ? (
          <button disabled>
            <img src="/icons/arrow-right.svg" />
          </button>
        ) : (
          <button onClick={() => setNewPage(currentPage + 1)}>
            <img src="/icons/arrow-right-active.svg" />
          </button>
        )}
      </div>
    </>
  );
}

export default QnaPagination;
