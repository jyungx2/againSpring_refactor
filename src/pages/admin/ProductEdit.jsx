import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { uploadProductImage } from "@utils/uploadProductImage";
import { useProductStore } from "@store/useProductStore";

// select로 표시할 카테고리 목록 (AdminProductUpload와 동일)
const CATEGORY_OPTIONS = [
  { label: "주방용품", value: "kitchen" },
  { label: "세탁용품", value: "laundry" },
  { label: "욕실용품", value: "bathroom" },
  { label: "문구용품", value: "stationery" },
  { label: "식품", value: "food" },
  { label: "생활잡화", value: "life" },
  { label: "반려동물", value: "pet" },
];

// 카테고리 배열을 한글로 변환하는 함수 (AdminProductUpload와 동일)
const getDisplayCategory = (categories) => {
  return categories
    .filter((cat) => cat !== "all-of-list")
    .map((cat) => {
      const option = CATEGORY_OPTIONS.find((opt) => opt.value === cat);
      return option ? option.label : cat;
    })
    .join(",");
};

// 이미지 경로가 절대경로인지 확인 (AdminProductUpload와 동일)
const getImage = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  const baseURL = "https://fesp-api.koyeb.app/market";
  return `${baseURL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const ProductEdit = () => {
  const location = useLocation(); // Detail 페이지에서 전달된 DB 등록 상품 정보를 받음
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();
  const fileInputRef = useRef(null);

  // Zustand 스토어에서 기존 AdminProductUpload와 동일한 상태와 업데이트 함수를 사용합니다.
  const { product, setProduct, updateProduct, resetProduct } =
    useProductStore();

  // rawPrice 상태를 AdminProductUpload와 동일하게 사용 (가격 포맷팅용)
  const [rawPrice, setRawPrice] = useState("");

  // 수정 페이지 초기 렌더링 시, location.state에 상품 정보가 있는지 확인하고 스토어에 로드합니다.
  useEffect(() => {
    if (location.state) {
      setProduct(location.state);
      // 가격이 있을 경우 rawPrice도 초기화 (관리자 페이지와 동일)
      if (location.state.price) {
        setRawPrice(String(location.state.price));
      }
    } else {
      alert("수정할 상품 정보가 없습니다.");
      navigate(-1);
    }
  }, [location.state, setProduct, navigate]);

  // 가격 입력 필드 관련 핸들러 (AdminProductUpload와 동일)
  const handlePriceChange = (e) => {
    setRawPrice(e.target.value);
    updateProduct({ price: e.target.value });
  };

  const handlePriceBlur = () => {
    const numericValue = Number(rawPrice);
    if (isNaN(numericValue)) {
      alert("가격은 숫자만 입력 가능합니다.");
      setRawPrice("");
      updateProduct({ price: "" });
    } else {
      const formatted = numericValue.toLocaleString("ko-KR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
      updateProduct({ price: numericValue.toString() });
      setRawPrice(formatted);
    }
  };

  const handlePriceFocus = () => {
    const unformatted = rawPrice.replace(/,/g, "");
    setRawPrice(unformatted);
    updateProduct({ price: unformatted });
  };

  // 나머지 입력 필드 변경 핸들러 (AdminProductUpload와 동일)
  const handleChange = (e) => {
    updateProduct({ [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    updateProduct({
      extra: {
        ...product.extra,
        category: ["all-of-list", selected],
      },
    });
  };

  const handleTansoChange = (e) => {
    updateProduct({
      extra: {
        ...product.extra,
        tanso: e.target.value,
      },
    });
  };

  // 이미지 관련 핸들러 (AdminProductUpload와 동일)
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (product.mainImages.length + files.length > 4) {
      alert("이미지는 최대 4개까지 선택 가능합니다.");
      e.target.value = "";
      return;
    }
    const previews = files.map((file) => ({
      file,
      path: URL.createObjectURL(file),
      name: file.name,
      originalname: file.name,
    }));
    setProduct({
      ...product,
      mainImages: [...product.mainImages, ...previews],
    });
  };

  const handleViewImage = (img) => {
    setModalImage(img);
  };

  const [modalImage, setModalImage] = useState(null);
  const handleCloseModal = () => {
    setModalImage(null);
  };

  const handleSetRepresentative = (index) => {
    if (index === 0) return;
    const images = [...product.mainImages];
    const selected = images.splice(index, 1)[0];
    images.unshift(selected);
    setProduct({
      ...product,
      mainImages: images,
    });
  };

  const handleDeleteImage = (index) => {
    const images = [...product.mainImages];
    images.splice(index, 1);
    setProduct({
      ...product,
      mainImages: images,
    });
  };

  const renderImagePreview = () => {
    if (product.mainImages.length === 0) return null;
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {product.mainImages.map((img, idx) => (
          <div key={idx} className="relative group">
            {idx === 0 && (
              <span className="absolute top-0 left-0 bg-blue-500 text-white text-xl px-1">
                대표이미지
              </span>
            )}
            <img
              src={getImage(img.path)}
              alt={img.name}
              className="w-60 h-60 object-cover border border-gray-300"
            />
            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewImage(img);
                  }}
                  className="text-white text-2xl"
                >
                  🔍
                </button>
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetRepresentative(idx);
                    }}
                    className="text-white text-2xl"
                  >
                    Main
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(idx);
                  }}
                  className="text-white text-2xl"
                >
                  ✖
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ProductEdit에서는 DB에 등록된 상품을 수정하기 때문에, "수정 완료" 버튼 클릭 시 PATCH 요청을 보냅니다.
  // 기존 AdminProductUpload의 로컬 수정 기능과는 달리, 여기서는 바로 API 호출합니다.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.content) {
      alert("상품명, 가격, 상품 설명은 필수 항목입니다.");
      return;
    }
    try {
      // 이미지 파일 업로드 후 최종 URL로 교체
      const uploadedImages = await Promise.all(
        product.mainImages.map(async (img) => {
          if (img.file) {
            const finalUrl = await uploadProductImage(img.file);
            return { ...img, path: finalUrl, file: undefined };
          }
          return img;
        })
      );
      const productData = {
        ...product,
        mainImages: uploadedImages,
        price: Number(product.price),
        quantity: Number(product.quantity),
        shippingFees: Number(product.shippingFees),
        extra: {
          ...product.extra,
          tanso: Number(product.extra.tanso),
        },
      };

      // PATCH 요청을 보내어 DB의 상품 정보를 수정합니다.
      await axiosInstance.patch(`/seller/products/${product._id}`, productData);
      alert("상품이 정상적으로 수정되었습니다.");
      navigate(`/detail/${product._id}`); // 수정 완료 후, 상세 페이지로 이동
    } catch (error) {
      console.error("상품 수정 실패:", error.response?.data || error.message);
      alert("상품 수정에 실패했습니다. 에러 메시지를 확인해주세요.");
    }
  };

  return (
    <div className="w-[1200px] px-[16px] my-[40px] mx-auto">
      <h2 className="text-5xl font-semibold flex items-center gap-2 mb-6">
        📦 관리자 상품 수정 페이지
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* 상품 기본 정보 입력 영역 */}
        <div className="border rounded-md p-4 mb-4">
          <h3 className="text-2xl font-semibold mb-4">상품 기본 정보</h3>
          <select
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-40"
            onChange={handleCategoryChange}
            value={product.extra.category[1] || ""}
          >
            <option value="" disabled>
              카테고리를 선택해주세요.
            </option>
            {/*CATEGORY_OPTIONS q배열의 각 요소를 순회할 때 사용하는 cat  */}
            {CATEGORY_OPTIONS.map(
              (
                cat // 배열의 각 항목을 순회함
              ) => (
                //  cat에 대해 option 태그 생성
                <option
                  key={cat.value} // {/* 배열을 랜더링할 때 각 요소에 고유한 key를 부여하고  */}
                  value={cat.value} // {/* 옵션태그의 값으로 사용되며 관리자가 선택하려고 할때 해당 값 선택  */}
                >
                  {cat.label} {/* 드롭다운 메뉴 표시 */}
                </option>
              )
            )}
          </select>
          <div className="grid grid-cols-4 gap-4 mt-4">
            <input
              type="text"
              name="name"
              placeholder="상품명"
              onChange={handleChange}
              value={product.name || ""}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="price"
              placeholder="가격"
              onChange={handlePriceChange}
              onBlur={handlePriceBlur}
              onFocus={handlePriceFocus}
              value={rawPrice}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="quantity"
              placeholder="수량"
              onChange={handleChange}
              value={product.quantity || ""}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="shippingFees"
              placeholder="배송비"
              onChange={handleChange}
              value={product.shippingFees || ""}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* 추가 옵션 영역 */}
        <div className="border rounded-md p-4 mb-4">
          <h3 className="text-2xl font-semibold mb-3">추가 옵션</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <span className=" text-gray-700">신상품</span>
                <div
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                    product.extra.isNew ? "bg-primary-40" : "bg-gray-300"
                  }`}
                  onClick={() =>
                    setProduct({
                      ...product,
                      extra: { ...product.extra, isNew: !product.extra.isNew },
                    })
                  }
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300 ${
                      product.extra.isNew ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <span className="text-gray-700">베스트 상품</span>
                <div
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                    product.extra.isBest ? "bg-primary-40" : "bg-gray-300"
                  }`}
                  onClick={() =>
                    setProduct({
                      ...product,
                      extra: {
                        ...product.extra,
                        isBest: !product.extra.isBest,
                      },
                    })
                  }
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300 ${
                      product.extra.isBest ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>
            </div>
            <input
              type="number"
              step="0.1"
              placeholder="탄소 수치 (ex: 4.8)"
              onChange={handleTansoChange}
              value={product.extra.tanso || ""}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* 파일 업로드 섹션 */}
        <div className="border rounded-md p-4 mb-4">
          <h3 className="text-2xl font-semibold mb-2">이미지 업로드</h3>
          <div className="border border-gray-300 rounded-md p-3">
            <input
              type="file"
              ref={fileInputRef}
              name="image"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <label
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
              className="cursor-pointer inline-block bg-primary-40 px-4 py-2 text-white hover:bg-primary-60 transition-colors duration-300 rounded-md"
            >
              파일 선택
            </label>
            {renderImagePreview()}
          </div>
        </div>

        {/* 상품 설명 영역 */}
        <div className="border rounded-md p-4 mb-4">
          <h3 className="text-2xl font-semibold mb-2">상품 설명</h3>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md resize-none h-40"
            name="content"
            placeholder="상품 설명"
            onChange={handleChange}
            value={product.content}
            required
          />
        </div>

        {/* 수정 완료 버튼 */}
        <button
          type="submit"
          className="w-full bg-primary-40 p-3 text-white rounded-md hover:bg-primary-60 transition-colors duration-300"
        >
          수정 완료
        </button>
      </form>

      {/* 이미지 확대보기 */}
      {modalImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          onClick={handleCloseModal}
        >
          <div className="relative">
            <img
              src={getImage(modalImage.path)}
              alt={modalImage.name}
              className="max-w-full max-h-screen"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseModal();
              }}
              className="absolute top-2 right-2 text-black text-6xl"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEdit;
