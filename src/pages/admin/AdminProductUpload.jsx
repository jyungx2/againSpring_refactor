import { useEffect, useRef, useState } from "react";
import useProductApi from "@hooks/useAddProduct";
import { uploadProductImage } from "@utils/uploadProductImage";
import { useProductStore } from "@store/useProductStore";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosInstance from "@hooks/useAxiosInstance";

// select로 표시할 카테고리 목록
const CATEGORY_OPTIONS = [
  { label: "주방용품", value: "kitchen" },
  { label: "세탁용품", value: "laundry" },
  { label: "욕실용품", value: "bathroom" },
  { label: "문구용품", value: "stationery" },
  { label: "식품", value: "food" },
  { label: "생활잡화", value: "life" },
  { label: "반려동물", value: "pet" },
];

// 카테고리 배열을 영어 -> 한글로 변환
const getDisplayCategory = (categories) => {
  return categories
    .filter((cat) => cat !== "all-of-list") // 실제 표시할 카테고리 값만 남기기 위해 배열에서 제거
    .map((cat) => {
      //필터링 된 각 카테고리 값에 대해 CATEGORY_OPTIONS 배열에서 해당 값(한글 라벨)과 일치하는 객체를 찾는다.
      const option = CATEGORY_OPTIONS.find((opt) => opt.value === cat);
      // 만약 일치하는 객체(option)이 있다면 그 객체의 label값(한글)을 반환하고
      //cat이 kitchen 이면 option은 label:주방용품,value:kitchen이 되고 반환 값은 주방용품이 된다.
      return option ? option.label : cat; // 일치하는 객체가 없다면 그대로 cat 갑을 반환.
    })
    .join(","); // 최종적으로 매핑된 결과 배열을 콤마로 연결해서 하나의 문자열로 만듬.
};
// 이미지 경로가 절대경로인지 확인하고, 아니라면 base URL을 붙임
const getImage = (path) => {
  if (!path) return ""; // path가 없으면 빈 문자열 반환
  if (path.startsWith("http") || path.startsWith("blob:")) return path; // 이미 전체 URL이면 그대로 반환, 단 blob URL일 경우 그대로 반환하도록 설정
  const baseURL = "https://fesp-api.koyeb.app/market";
  // path가 '/'로 시작하지 않으면 추가
  return `${baseURL}${path.startsWith("/") ? "" : "/"}${path}`;
};

// AdminProductUpload - 컴포넌트 내부에서 가격 입력 필드와 관련된 상태와 핸들러
const AdminProductUpload = () => {
  const location = useLocation();
  // ===================productToEdit 디버깅==========================
  // const productToEdit = location.state; // Detail.jsx에서 navigate로 넘어온 productDetails
  // console.log('받아온 productToEdit:', productToEdit);
  // ==================================================================
  const navigate = useNavigate();

  const { addProduct } = useProductApi(); // 상품 등록 API 호출

  // 파일 input 요소에 접근하기 위한 참조 (useRef)
  const fileInputRef = useRef(null);

  // 입력 필드에 표시되는 값을 관리하는 별도의 상태관리
  const [rawPrice, setRawPrice] = useState(""); // 사용자가 입력할 때는 원시 숫자 문자열로, onBlur 시 포맷팅되어 1000단위 구분 기호가 적용된 문자열로 변경

  // Zustand 스토어에서 필요한 상태와 업데이트 함수를 가져옴
  const {
    product,
    setProduct,
    updateProduct,
    productList,
    addProductToList,
    updateProductList,
    editingIndex,
    setEditingIndex,
    resetProduct,
    resetProductList,
  } = useProductStore();

  // 사용자가 입력 필드에 값을 입력할 때마다 호출
  const handlePriceChange = (e) => {
    // rawPrice와 product.price를 사용자가 입력한 원시값으로 업데이트 (ex:1000)
    setRawPrice(e.target.value); // 입력 필드에 표시될 원시 값 업데이트
    updateProduct({ price: e.target.value }); // procuct 상태의 price 필드도 동일한 원시 값을 업데이트
  };

  // onBlur 이벤트 - 사용자가 입력 필드에서 focus를 잃을 때 호출
  const handlePriceBlur = () => {
    // 입력된 원시 숫자 문자열을 숫자로 변환한 후, 1000단위 구분 기호가 포함된 포맷된 문자열로 변경
    const numericValue = Number(rawPrice); // number()를 사용하여 rawPrice를 숫자로 변환
    if (isNaN(numericValue)) {
      // 숫자가아닌 다른 형식으로 입력하면 NaN이므로 유효성 검사 설정
      alert("가격은 숫자만 입력 가능합니다.");
      setRawPrice("");
      updateProduct({ price: "" });
    } else {
      // 변환 결과가 유요한 숫자 인지 검사
      const formatted = numericValue.toLocaleString("ko-KR", {
        // 숫자 값을 'ko-KR-'로케일로 포맷팅 (한국식 단위 구분기호로 적용)
        // 소수점 이하 자릿수 설정 방식 (1,000 이런식으로 표시하려면 min:0 max:2로 한다는걸 기억하기)
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
      // product.price에는 숫자값을 문자열 형태로 저장(콤마없이)
      updateProduct({ price: numericValue.toString() });
      // rawPrice를 포맷팅된 문자열로 업데이트하여, 입력필드에는 1000단위 구분 기호가 적용된 값이 보임.
      setRawPrice(formatted);
    }
  };
  // 사용자가 가격 입력필드를 클릭해 수정하려고 할떄 호출
  const handlePriceFocus = () => {
    // 사용자가 필드를 클릭하면, 현재 입력된 값에서 콤마를 제거하여 원시 숫자로 복원
    const unformatted = rawPrice.replace(/,/g, "");
    setRawPrice(unformatted); // rawPrice를 원시 숫자 문자열로 업데이트
    updateProduct({ price: unformatted }); // product.price도 원시 값으로 업데이트하여 사용자가 수정하기 편한 상태로 만듦
  };

  // AdminProductUpload로 이동할 때마다 location.state의 유무에 따라 폼이 올바르게 초기화해주는 로직
  useEffect(() => {
    if (location.state) {
      // 수정 모드 진입: Detail 페이지에서 전달받은 수정할 상품 데이터가 있는 경우
      setProduct(location.state);
      if (location.state.price) {
        setRawPrice(String(location.state.price));
      }
      setEditingIndex(/* 필요한 경우 인덱스 또는 null */);
    } else {
      // 수정할 상품 데이터가 없는 경우, 즉 새로 들어온 경우에는 폼을 초기 상태로 리셋합니다.
      resetProduct();
      setRawPrice("");
      setEditingIndex(null);
    }
  }, [location.state, resetProduct]);

  // 확대보기할 이미지를 저장하는 상태관리 - 모달 이미지 상태 (null이면 모달 미표시)
  // 즉 새창으로 이미지를 보여주지 않기위함 -UI 측면에 이점
  const [modalImage, setModalImage] = useState(null);

  // 인풋 값 변경 이벤트 핸들러
  const handleChange = (e) => {
    updateProduct({ [e.target.name]: e.target.value }); // 상품 정보 업데이트
  };

  // 카테고리 변경 이벤트 핸들러
  const handleCategoryChange = (e) => {
    const selected = e.target.value; // 선택된 카테고리
    updateProduct({
      // 상품 정보 업데이트
      extra: {
        // extra 정보 업데이트
        ...product.extra, // 기존 extra 정보 유지
        category: ["all-of-list", selected], // 선택된 카테고리 추가
      },
    });
  };

  // 탄소 수치 변경 이벤트 핸들러
  const handleTansoChange = (e) => {
    updateProduct({
      // 상품 정보 업데이트
      extra: {
        // extra 정보 업데이트
        ...product.extra, // 기존 extra 정보 유지
        tanso: e.target.value, // 탄소 수치 숫자로 변환
      },
    });
  };

  //---------------------------------------------------------------------
  // 스위치 형식으로 변경 (인라인으로 토글 로직 처리) 함에 따라 함수 미사용 (삭제 보류)
  // 신상품 변경 이벤트 핸들러
  // const handleIsNewChange = (e) => {
  //   setProduct((prev) => ({
  //     // 상품 정보 업데이트
  //     ...prev, // 기존 상품 정보 유지
  //     extra: {
  //       // extra 정보 업데이트
  //       ...prev.extra, // 기존 extra 정보 유지
  //       isNew: e.target.checked, // 체크 여부에 따라 isNew 값 변경
  //     },
  //   }));
  // };

  // const handleIsBestChange = (e) => {
  //   setProduct((prev) => ({
  //     // 상품 정보 업데이트
  //     ...prev, // 기존 상품 정보 유지
  //     extra: {
  //       ...prev.extra,
  //       isBest: e.target.checked, // 체크 여부에 따라 isBest 값 변경
  //     },
  //   }));
  // };
  //---------------------------------------------------------------------

  // 이미지 변경 이벤트 핸들러
  // 이미지 선택 시 파일을 즉시 업로드 하는 로직 삭제 후  로컬 미리보기용 URL 생성
  const handleImageChange = async (e) => {
    // e.target.files는 사용자가 선택한 파일들의 fileList 객체
    const files = Array.from(e.target.files); // 파일 목록을 일반 배열로 변환

    // 이미지 4개 초과시 알림 후 취소 설정 (기존에 선택된 이미지도 합쳐짐)
    if (product.mainImages.length + files.length > 4) {
      alert("이미지는 최대 4개까지 선택 가능합니다.");
      e.target.value = ""; // 입력 초기화
      return;
    }

    // Promise.all을 사용하여 여러 이미지를 동시에 업로드 기능 삭제
    // 각 파일에 대한 로컬 미리보기 URL 생성 로직 구현
    const previews = files.map((file) => ({
      file, // 파일 객체 보존 - 나중에 서버 업로드를 위함
      path: URL.createObjectURL(file), // 로컬 미리보기용 URL 생성
      name: file.name, // 이미지 파일 이름
      originalname: file.name, // 이미지 원본 이름
    }));

    // 기존 prodct state에 저장된 mainImages 배열은 보존
    // 새로 업로드된 이미지 객체들이 담긴 배열(uploadImages) 삭제.
    // 미리보기 객체들을 기존 이미지 배열에 추가하여 상태 업데이트
    setProduct({
      // 상품 정보 업데이트
      ...product, // 기존 상품 정보 유지
      mainImages: [...product.mainImages, ...previews],
    });
  };

  // 이미지 확대보기 - 클릭 시 해당 이미지를 새창이 아닌 모달에 띄움
  const handleViewImage = (img) => {
    // console.log(img);
    setModalImage(img); // 선택된 이미지 정보를 modalImage 상태에 저장
  };

  // 모달 닫기 - 아무 화면에 버튼 클릭하면 모달을 닫음
  const handleCloseModal = () => {
    setModalImage(null);
  };

  // 대표 이미지 지정 - 선택된 이미지(index)가 배열의 첫번째로 오도록 재배열
  const handleSetRepresentative = (index) => {
    if (index === 0) return; // 이미 대표 이미지인 경우 아무작업X
    const images = [...product.mainImages];
    const selected = images.splice(index, 1)[0]; // 선택된 이미지 제거
    images.unshift(selected); // 배열의 시작에 추가하여 대표 이미지로 설정
    setProduct({
      ...product,
      mainImages: images,
    });
  };

  // 이미지 삭제 핸들러 - 선택된 이미지를 배열에서 제거
  const handleDeleteImage = (index) => {
    const images = [...product.mainImages];
    images.splice(index, 1); // 선택된 이미지 제거
    setProduct({
      ...product,
      mainImages: images,
    });
  };

  // 미리보기 UI 렌더링 함수 - 선택된 이미지들이 있는 경우 썸네일과 각 이미지별 제어 버튼 표시
  const renderImagePreview = () => {
    if (product.mainImages.length === 0) return null;
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {product.mainImages.map((img, idx) => (
          <div key={idx} className="relative group">
            {idx === 0 && (
              <span className="absolute top-0 left-0 bg-blue-500 text-white text-xl px-1 rounde">
                대표이미지
              </span>
            )}
            <img
              src={getImage(img.path)}
              alt={img.name}
              className="w-60 h-60 object-cover border border-gray-300"
            />

            {/* 오버레이 컨트롤 - 버튼들을 호버시 이미지 위에 등장 */}
            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition">
              <div className="flex space-x-4">
                {/* 확대보기 */}
                <button
                  type="button"
                  onClick={(e) => {
                    // preventDefault는 현재 이벤트의 기본 동작을 중단한다면 stopPropagation은 부모 엘리먼트로의 이벤트전달을 막아주는 함수
                    // 즉 의도치 않은 동작을 방지하며 이미지 보기와 대표이미지, 이미지삭제 이벤트가 단독으로 실행되도록 하게함
                    e.stopPropagation();
                    handleViewImage(img);
                  }}
                  className="text-white text-2xl"
                >
                  🔍
                </button>

                {/* 대표이미지 지정 버튼 (첫 번째 이미지가 아닐때만) */}
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
                {/* 이미지 삭제 */}
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
  const axiosInstance = useAxiosInstance();
  // 상품 추가 또는 수정
  // 기존 코드에서는 편집 모드일 경우 DB 수정(PATCH) API를 호출했습니다.
  // 여기서 수정된 코드는 로컬에만 저장되어 있는 상품 목록(productList)을 업데이트하도록 변경했습니다.
  const handleAddorUpdateProduct = async () => {
    if (!product.name || !product.price) {
      alert("상품명과 가격은 필수 입력 사항입니다.");
      return;
    }

    if (editingIndex === null) {
      // 신규 상품 추가: 로컬 상태(productList)에 상품을 추가합니다.
      addProductToList(product);
      resetProduct(); // 신규 상품 추가 후 폼 초기화 호출하여 입력 필드 리셋
    } else {
      // 편집 모드: 기존 코드는 DB에 수정(PATCH) 요청을 보냈지만,
      // 아직 DB에 등록되지 않은 상품은 _id가 없으므로 API 호출을 하면 에러가 발생합니다.
      // 따라서 여기서는 단순히 로컬 목록을 업데이트합니다.
      const updatedList = productList.map((item, index) =>
        index === editingIndex ? product : item
      );
      updateProductList(updatedList);
      alert("상품이 로컬 목록에서 수정되었습니다.");
      setEditingIndex(null);
      resetProduct();
    }

    // rawPrice 초기화 및 파일 인풋 리셋
    setRawPrice("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 상품 목록 - 수정 버튼 클릭
  const handleEditProduct = (index) => {
    // 해당 상품 데이터를 폼에 로드하여 수정
    setProduct(productList[index]);
    setEditingIndex(index);
    setRawPrice(productList[index].price);
  };

  // 상품 목록- 삭제 버튼 클릭
  const handleDeleteProduct = (index) => {
    // 해당 상품을 목록에서 제거
    updateProductList(productList.filter((_, i) => i !== index));
  };

  // 상품 등록 이벤트 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 이벤트 기본 동작 방지

    // 등록할 상품이 없는 상태에서 제출할 경우
    if (productList.length === 0) {
      alert("등록할 상품이 없습니다.");
      return;
    }

    // 상품 필드 검증 (이미 백엔드 로직에 구현되어있으나 프론트에서도 추가로 검증)
    for (const p of productList) {
      if (p.name.length < 2) {
        alert("상품명은 최소 2글자 이상 입력해야합니다.");
        return;
      }
      if (p.content.length < 10) {
        alert("상품 설명은 최소 10자 이상 입력해야 합니다.");
        return;
      }
    }

    // 각 상품별 이미지 업로드 처리
    try {
      const productsToUpload = await Promise.all(
        // productList 배열을 순회하면서 각 상품 객체를 순서대로 담음
        productList.map(async (p) => {
          const uploadedImages = await Promise.all(
            p.mainImages.map(async (img) => {
              if (img.file) {
                // 서버에 업로드하여 최종 URL 반환
                const finalUrl = await uploadProductImage(img.file);
                // 최종 URL로 대체하고 file 속성은 제거
                return { ...img, path: finalUrl, file: undefined };
              }
              return img;
            })
          );
          return {
            // 상품 데이터 반환
            ...p, // 실제 productList의 저장된 각 상품 객체
            mainImages: uploadedImages, // 각 상품의mainImages 필드를 서버 업로드 결괴인 uploadedImages 배열로 대체
            price: Number(p.price), // 가격, 수량, 배송비는 숫자로 변환
            quantity: Number(p.quantity), // 가격, 수량, 배송비는 숫자로 변환
            shippingFees: Number(p.shippingFees), // 가격, 수량, 배송비는 숫자로 변환
            extra: {
              ...p.extra,
              // 최종 제출 시 문자열로 저장된 tanso를 숫자로 변환
              tanso: Number(p.extra.tanso),
            },
          };
        })
      );

      // 상품 등록 요청
      await Promise.all(productsToUpload.map((p) => addProduct(p)));
      alert("모든 상품이 등록되었습니다."); // 성공 메시지 출력
      resetProductList(); // 등록 성공 후 목록 초기화
      resetProduct(); // 개별 상품 폼 초기화
      setRawPrice(""); // 가격 입력 필드 초기화
      if (fileInputRef.current) {
        // 파일 인풋 초기화
        fileInputRef.current.value = "";
      }
    } catch (error) {
      // 상품 등록 실패 시
      console.error("상품 등록 실패:", error.response?.data || error.message); // 에러 메시지 출력
      alert("상품 등록에 실패하였습니다. 에러 메시지를 확인해 주세요.");
    }
  };

  return (
    <div className="w-[1200px] px-[16px] my-[40px] mx-auto">
      <h2 className="text-5xl font-semibold flex items-center gap-2 mb-6">
        📦 관리자 상품 등록 페이지
      </h2>
      {/* 상품 등록 폼 */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* 상품 기본 정보 입력 필드 */}
        <div className="border rounded-md p-4 mb-4">
          <h3 className="text-2xl font-semibold mb-4">상품 기본 정보</h3>
          <div className="grid gird-cols-1 gap-4">
            {/* 카테고리 선택 */}
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
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            <input
              type="text"
              name="name"
              placeholder="상품명"
              onChange={handleChange}
              value={product.name}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            {/* <input type="number" name="price" placeholder="가격" onChange={handleChange} value={product.price} className="w-full p-3 border border-gray-300 rounded-md" /> */}
            <input
              type="text" // type=number가아니라 type text를 사용해야 브라우저 기본 숫자 검증 없이 자유롭게 입력가능
              name="price"
              placeholder="가격"
              // onFocus={(e) => console.log("포커스 들어옴")}
              // onBlur={(e) => console.log("포커스 벗어남")}
              onChange={handlePriceChange} // 사용자가 입력할 때마다 원시값 업데이트
              onBlur={handlePriceBlur} // 포커스가 벗어나면 천 단위 구분 기호적용
              onFocus={handlePriceFocus} // 포커스가 들어가면 콤마 제거하고 원시 값 복원함
              value={rawPrice} // 입력 필드에 rawPrice 상태를 표시
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="quantity"
              placeholder="수량"
              onChange={handleChange}
              value={product.quantity}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="shippingFees"
              placeholder="배송비"
              onChange={handleChange}
              value={product.shippingFees}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* 추가 옵션 영역 */}
        <div className="border rounded-md p-4 mb-4">
          <h3 className="text-2xl font-semibold mb-3">추가 옵션</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
              {/* 신상품 토글 */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <span className=" text-gray-700">신상품</span>
                <div
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 
                    ${product.extra.isNew ? "bg-primary-40" : "bg-gray-300"}`}
                  onClick={() =>
                    setProduct({
                      ...product,
                      extra: { ...product.extra, isNew: !product.extra.isNew },
                    })
                  }
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300
                  ${product.extra.isNew ? "translate-x-6" : "translate-x-0"}`}
                  />
                </div>
              </label>

              {/* 베스트상품 토글 */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <span className="text-gray-700">베스트 상품</span>
                <div
                  className={` w-12 h-6 flex items-center rounded-full p-1 transition duration-300 
                    ${product.extra.isBest ? "bg-primary-40" : "bg-gray-300"}`}
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
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300
                    ${
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
              value={product.extra.tanso}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        {/* 파일 업로드 섹션 */}
        <div className="border rounded-md p-4 mb-4">
          <h3 className="text-2xl font-semibold mb-2">이미지 업로드</h3>
          <div className="border border-gray-300 rounded-md p-3">
            {/* 기존의 input type= file 요소를 숨기고 ref 속성을 통해 fileInputRef에 연결 */}
            <input
              type="file"
              ref={fileInputRef}
              name="image"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            {/* 커스텀 파일 선택 버튼 생성 - 버튼 혹은 라벨 클릭시 fileInputRef를 통헤 
          숨겨진 파일 입력의 click 메소드 호출 */}
            <label
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
              className="cursor-pointer inline-block bg-primary-40 px-4 py-2 text-white hover:bg-primary-60 transition-colors duration-300 rounded-md"
            >
              파일 선택
            </label>
            {/* 미리보기 영역 - 썸네일 표시 */}
            {renderImagePreview()}
          </div>
        </div>
        {/* 상품 설명 섹션 */}
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
        {/* 상품 추가, 수정 버튼 */}
        <button
          type="button"
          onClick={handleAddorUpdateProduct}
          className="w-full bg-primary-40 p-3 mt-4 text-white hover:bg-primary-60 transition-colors duration-300 ml-auto"
        >
          {editingIndex === null ? "상품 추가" : "수정 완료"}
        </button>
      </form>

      {/* 상품 등록된 목록 랜더 table*/}
      <h3 className="text-5xl font-semibold mt-20">🛒 추가된 상품 목록</h3>
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">이미지</th>
            <th className="border border-gray-300 p-2">상품명</th>
            <th className="border border-gray-300 p-2">수량</th>
            <th className="border border-gray-300 p-2">가격</th>
            <th className="border border-gray-300 p-2">탄소</th>
            <th className="border border-gray-300 p-2">신상품</th>
            <th className="border border-gray-300 p-2">베스트 상품</th>
            <th className="border border-gray-300 p-2">카테고리</th>
            <th className="border border-gray-300 p-2">수정 / 삭제</th>
          </tr>
        </thead>
        <tbody>
          {productList.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="border border-gray-300 p-4 text-center"
              >
                추가된 상품 목록이 없습니다.
              </td>
            </tr>
          ) : (
            productList.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 p-2">
                  <div className="flex gap-2 justify-center">
                    {item.mainImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        {idx === 0 && (
                          <span className="absolute top-0 left-0 bg-blue-500 text-white text-xl px-1 rounded">
                            대표이미지
                          </span>
                        )}
                        <img
                          src={img.path}
                          alt={`${item.name}-${idx}`}
                          className="w-32 h-32 object-cover border border-gray-300"
                        />
                      </div>
                    ))}
                  </div>
                </td>
                <td className="border border-gray-300 p-2">{item.name}</td>
                <td className="border border-gray-300 p-2">{item.quantity}</td>
                <td className="border border-gray-300 p-2">
                  {Number(item.price).toLocaleString()}원
                </td>
                <td className="border border-gray-300 p-2">
                  {item.extra.tanso}
                </td>
                <td className="border border-gray-300 p-2">
                  {item.extra.isNew ? "✔️" : "-"}
                </td>
                <td className="border border-gray-300 p-2">
                  {item.extra.isBest ? "✔️" : "-"}
                </td>
                <td className="border border-gray-300 p-2">
                  {getDisplayCategory(item.extra.category)}
                </td>

                <td className="border border-gray-300 p-2">
                  <button
                    type="button"
                    onClick={() => handleEditProduct(index)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(index)}
                    className="text-red-500 hover:underline mr-2"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 이미지 확대보기 */}
      {modalImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          onClick={handleCloseModal}
        >
          <div className="relative">
            <img
              src={modalImage.path}
              alt={modalImage.name}
              className="max-w-full max-h-screen"
            />
            {/* <h1>이미지를 클릭하면 닫힘</h1> */}
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
      <button
        type="submit"
        onClick={handleSubmit}
        className="w-full bg-secondary-40 p-3 mt-4 text-white hover:bg-secondary-60 transition-colors duration-300 ml-auto"
      >
        전체 상품 등록
      </button>
    </div>
  );
};

export default AdminProductUpload;
