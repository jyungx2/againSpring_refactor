import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import QnAProductModal from "@pages/qna/QnAProductModal";

/**
 * 게시글 폼 컴포넌트
 * 공지사항과 Q&A 게시글 작성/수정 시 공통으로 사용되는 폼
 * @param {string} type - 게시글 타입 (notice 또는 qna)
 * @param {boolean} isEdit - 수정 모드 여부
 * @param {string} title - 게시글 제목
 * @param {Function} setTitle - 제목 업데이트 함수
 * @param {object} quillRef - Quill 에디터 참조 객체
 * @param {object} selectedProduct - 선택된 상품 정보 (Q&A에서만 사용)
 * @param {boolean} isProductPost - 상품 관련 게시글 여부
 * @param {boolean} isModalOpen - 상품 선택 모달 표시 여부
 * @param {Function} openModal - 모달 열기 함수
 * @param {Function} closeModal - 모달 닫기 함수
 * @param {Function} handleProductSelect - 상품 선택 처리 함수
 * @param {Function} handleProductRemove - 선택된 상품 제거 함수
 * @param {boolean} isLoading - 로딩 상태
 * @param {Function} handleSave - 저장 처리 함수
 * @param {Function} handleCancel - 취소 처리 함수
 */
export default function PostForm({
  type = "notice",
  isEdit = false,
  title,
  setTitle,
  quillRef,

  selectedProduct,
  isProductPost = false,
  isModalOpen = false,
  openModal,
  closeModal,
  handleProductSelect,
  handleProductRemove,

  isLoading = false,
  handleSave,
  handleCancel,
}) {
  /**
   * 게시글 타입에 따른 페이지 제목을 반환하는 함수
   * @returns {string} 페이지 제목
   */
  const getPageTitle = () => {
    switch (type) {
      case "qna":
        return "Q&A";
      case "notice":
        return "공지사항";
      default:
        return "";
    }
  };

  return (
    <div className="w-[1200px] mx-auto px-6 relative min-h-screen pb-52">
      <h1 className="h-[80px] text-4xl text-center box-border m-0 px-0 py-[20px]">
        {getPageTitle()}
      </h1>

      {type === "qna" && isProductPost && (
        <div className="flex items-center mb-4 p-6 border rounded-md w-full">
          <div className="mr-6 relative">
            {selectedProduct?.mainImages?.length > 0 ? (
              <>
                <img
                  src={selectedProduct.mainImages[0].path}
                  alt={selectedProduct.name}
                  className="w-32 h-32 bg-gray-200 flex items-center justify-center text-sm text-gray-600"
                />
                <button
                  onClick={handleProductRemove}
                  className="absolute -top-3 -right-3 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center hover:bg-grey-70 transition-colors"
                >
                  x
                </button>
              </>
            ) : (
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                No Image
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 justify-center h-32">
            <div className="text-lg">
              {selectedProduct ? (
                <>
                  상품명: {selectedProduct.name}
                  {selectedProduct.price &&
                    ` ${selectedProduct.price.toLocaleString()}원`}
                </>
              ) : (
                "상품을 선택해주세요"
              )}
            </div>
            <div className="flex gap-4">
              <button
                className="px-6 py-2.5 bg-black text-white text-base rounded hover:bg-gray-800"
                disabled={!selectedProduct}
              >
                <Link
                  to={selectedProduct ? `/detail/${selectedProduct._id}` : "#"}
                  className={!selectedProduct ? "pointer-events-none" : ""}
                >
                  상품상세보기
                </Link>
              </button>
              <button
                className="px-6 py-2.5 border border-black text-base rounded hover:bg-gray-50"
                onClick={openModal}
              >
                상품정보선택
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        className="w-full mb-4 box-border border py-2 px-4 rounded-md text-xl h-[50px]"
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="w-full">
        <div className="min-h-[400px] h-[60vh] max-h-[800px]">
          <div ref={quillRef} className="h-full" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-[38px] py-10">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-secondary-20 text-white disabled:opacity-50"
        >
          {isEdit ? "수정하기" : "등록하기"}
        </button>
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="rounded-[10px] border-none py-[15px] px-[10px] w-[100px] cursor-pointer bg-grey-20 disabled:opacity-50"
        >
          취소하기
        </button>
      </div>

      {type === "qna" && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[calc(100vh-2rem)] overflow-hidden">
            <QnAProductModal
              onClose={closeModal}
              onProductSelect={handleProductSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}

PostForm.propTypes = {
  type: PropTypes.oneOf(["notice", "qna"]),
  isEdit: PropTypes.bool,
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  quillRef: PropTypes.object.isRequired,
  selectedProduct: PropTypes.object,
  isProductPost: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  handleProductSelect: PropTypes.func,
  handleProductRemove: PropTypes.func,
  isLoading: PropTypes.bool,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};
