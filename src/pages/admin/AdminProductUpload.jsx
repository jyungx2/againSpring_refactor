import { useRef, useState } from 'react';
import useProductApi from '@hooks/useAddProduct';
import { uploadProductImage } from '@utils/uploadProductImage';

// select로 표시할 카테고리 목록
const CATEGORY_OPTIONS = [
  { label: '주방용품', value: 'kitchen' },
  { label: '세탁용품', value: 'laundry' },
  { label: '욕실용품', value: 'bathroom' },
  { label: '문구용품', value: 'stationery' },
  { label: '식품', value: 'food' },
  { label: '생활잡화', value: 'life' },
  { label: '반려동물', value: 'pet' },
];

// 카테고리 배열을 영어 -> 한글로 변환
const getDisplayCategory = (categories) => {
  return categories
    .filter((cat) => cat !== 'all-of-list') // 실제 표시할 카테고리 값만 남기기 위해 배열에서 제거
    .map((cat) => {
      //필터링 된 각 카테고리 값에 대해 CATEGORY_OPTIONS 배열에서 해당 값(한글 라벨)과 일치하는 객체를 찾는다.
      const option = CATEGORY_OPTIONS.find((opt) => opt.value === cat);
      // 만약 일치하는 객체(option)이 있다면 그 객체의 label값(한글)을 반환하고
      //cat이 kitchen 이면 option은 label:주방용품,value:kitchen이 되고 반환 값은 주방용품이 된다.
      return option ? option.label : cat; // 일치하는 객체가 없다면 그대로 cat 갑을 반환.
    })
    .join(','); // 최종적으로 매핑된 결과 배열을 콤마로 연결해서 하나의 문자열로 만듬.
};

const AdminProductUpload = () => {
  // 관리자 상품 등록 페이지
  const { addProduct } = useProductApi(); // 상품 등록 API 호출

  // 파일 input 요소에 접근하기 위한 참조 (useRef)
  const fileInputRef = useRef(null);

  // 상품 정보 상태
  const [product, setProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    shippingFees: '',
    mainImages: [],
    content: '',
    extra: {
      isNew: false,
      isBest: false,
      category: ['all-of-list'],
      tanso: 0,
    },
  });

  //상품목록들 관리하기 위한 상태 관리
  const [productList, setProductList] = useState([]); // 등록할 상품들을 배열로 저장

  // 편집 모드일 때, 현재 편집 중인 상품의 인덱스를 저장하는 상태관리 (null이면 새상품 등록)
  const [editingIndex, setEditingIndex] = useState(null);

  // 확대보기할 이미지를 저장하는 상태관리 - 모달 이미지 상태 (null이면 모달 미표시)
  // 즉 새창으로 이미지를 보여주지 않기위함 -UI 측면에 이점
  const [modalImage, setModalImage] = useState(null);

  // 인풋 값 변경 이벤트 핸들러
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value }); // 상품 정보 업데이트
  };

  // 카테고리 변경 이벤트 핸들러
  const handleCategoryChange = (e) => {
    const selected = e.target.value; // 선택된 카테고리
    setProduct((prev) => ({
      // 상품 정보 업데이트
      ...prev, // 기존 상품 정보 유지
      extra: {
        // extra 정보 업데이트
        ...prev.extra, // 기존 extra 정보 유지
        category: ['all-of-list', selected], // 선택된 카테고리 추가
      },
    }));
  };

  // 탄소 수치 변경 이벤트 핸들러
  const handleTansoChange = (e) => {
    setProduct((prev) => ({
      // 상품 정보 업데이트
      ...prev, // 기존 상품 정보 유지
      extra: {
        // extra 정보 업데이트
        ...prev.extra, // 기존 extra 정보 유지
        tanso: Number(e.target.value), // 탄소 수치 숫자로 변환
      },
    }));
  };

  // 신상품 변경 이벤트 핸들러
  const handleIsNewChange = (e) => {
    setProduct((prev) => ({
      // 상품 정보 업데이트
      ...prev, // 기존 상품 정보 유지
      extra: {
        // extra 정보 업데이트
        ...prev.extra, // 기존 extra 정보 유지
        isNew: e.target.checked, // 체크 여부에 따라 isNew 값 변경
      },
    }));
  };

  const handleIsBestChange = (e) => {
    setProduct((prev) => ({
      // 상품 정보 업데이트
      ...prev, // 기존 상품 정보 유지
      extra: {
        ...prev.extra,
        isBest: e.target.checked, // 체크 여부에 따라 isBest 값 변경
      },
    }));
  };

  // 이미지 변경 이벤트 핸들러
  // 이미지 선택 시 파일을 즉시 업로드 하는 로직 삭제 후  로컬 미리보기용 URL 생성
  const handleImageChange = async (e) => {
    // e.target.files는 사용자가 선택한 파일들의 fileList 객체
    const files = Array.from(e.target.files); // 파일 목록을 일반 배열로 변환

    // 이미지 4개 초과시 알림 후 취소 설정 (기존에 선택된 이미지도 합쳐짐)
    if (product.mainImages.length + files.length > 4) {
      alert('이미지는 최대 4개까지 선택 가능합니다.');
      e.target.value = ''; // 입력 초기화
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
    setProduct((prev) => ({
      // 상품 정보 업데이트
      ...prev, // 기존 상품 정보 유지
      mainImages: [...prev.mainImages, ...previews],
    }));
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
    setProduct((prev) => {
      const images = [...prev.mainImages];
      const selected = images.splice(index, 1)[0]; // 선택된 이미지 제거
      images.unshift(selected); // 배열의 시작에 추가하여 대표 이미지로 설정
      return { ...prev, mainImages: images };
    });
  };

  // 이미지 삭제 핸들러 - 선택된 이미지를 배열에서 제거
  const handleDeleteImage = (index) => {
    setProduct((prev) => {
      const images = [...prev.mainImages];
      images.splice(index, 1); // 선택된 이미지 제거
      return { ...prev, mainImages: images };
    });
  };

  // 미리보기 UI 렌더링 함수 - 선택된 이미지들이 있는 경우 썸네일과 각 이미지별 제어 버튼 표시
  const renderImagePreview = () => {
    if (product.mainImages.length === 0) return null;
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {product.mainImages.map((img, idx) => (
          <div key={idx} className="relative group">
            {idx === 0 && <span className="absolute top-0 left-0 bg-blue-500 text-white text-xl px-1 rounde">대표이미지</span>}
            <img src={img.path} alt={img.name} className="w-60 h-60 object-cover border border-gray-300" />

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

  // 상품 추가 또는 수정
  const handleAddorUpdateProduct = () => {
    if (!product.name || !product.price) {
      alert('상품명과 가격은 필수 입력 사항입니다.');
      return;
    }

    // 새 상품 추가 (편집 모드가 아닌 경우)
    if (editingIndex === null) {
      setProductList([...productList, product]);
    } else {
      // 편집 모드일 경우 해당 인덱스의 상품 정보를 업데이트
      const updateList = productList.map((item, index) => (index === editingIndex ? product : item));
      setProductList(updateList);
      setEditingIndex(null); // 편집 상태 해제
    }

    // 상품 추가 또는 수정 했을 때 폼 초기화 로직
    setProduct({
      name: '',
      price: '',
      quantity: '',
      shippingFees: '',
      mainImages: [],
      content: '',
      extra: {
        isNew: false,
        isBest: false,
        category: ['all-of-list'],
        tanso: 0,
      },
    });

    // 파일 선택 후 취소하고 싶을 때 (파일 입력 초기화)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 상품 목록 - 수정 버튼 클릭
  const handleEditProduct = (index) => {
    // 해당 상품 데이터를 폼에 로드하여 수정
    setProduct(productList[index]);
    setEditingIndex(index);
  };

  // 상품 목록- 삭제 버튼 클릭
  const handleDeleteProduct = (index) => {
    // 해당 상품을 목록에서 제거
    setProductList(productList.filter((_, i) => i !== index));
  };

  // 상품 등록 이벤트 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 이벤트 기본 동작 방지

    // 등록할 상품이 없는 상태에서 제출할 경우
    if (productList.length === 0) {
      alert('등록할 상품이 없습니다.');
      return;
    }

    // 상품 필드 검증 (이미 백엔드 로직에 구현되어있으나 프론트에서도 추가로 검증)
    if (product.name.length < 2) {
      alert('상품명은 최소 2글자 이상 입력해야합니다.');
      return;
    }

    if (product.content.length < 10) {
      alert('상품 설명은 최소 10자 이상 입력해야 합니다.');
      return;
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
          };
        })
      );

      // 상품 등록 요청
      await Promise.all(productsToUpload.map((p) => addProduct(p)));
      alert('모든 상품이 등록되었습니다.'); // 성공 메시지 출력
      setProductList([]); // 등록 성공 후 목록 초기화
    } catch (error) {
      // 상품 등록 실패 시
      console.error('상품 등록 실패:', error.response?.data || error.message); // 에러 메시지 출력
      alert('상품 등록에 실패하였습니다. 에러 메시지를 확인해 주세요.');
    }
  };

  return (
    <div>
      <h2>관리자 상품 등록 페이지</h2>
      <form onSubmit={handleSubmit}>
        {/* 텍스트 입력 필드 */}
        <input type="text" name="name" placeholder="상품명" onChange={handleChange} value={product.name} />
        <input type="number" name="price" placeholder="가격" onChange={handleChange} value={product.price} />
        <input type="number" name="quantity" placeholder="수량" onChange={handleChange} value={product.quantity} />
        <input type="number" name="shippingFees" placeholder="배송비" onChange={handleChange} value={product.shippingFees} />
        <div>
          <label>
            <input type="checkbox" checked={product.extra.isNew} onChange={handleIsNewChange} />
            신상품
          </label>
          <label>
            <input type="checkbox" checked={product.extra.isBest} onChange={handleIsBestChange} />
            베스트 상품
          </label>
        </div>
        <select onChange={handleCategoryChange} value={product.extra.category[1] || ''}>
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
        <input type="number" step="0.1" placeholder="탄소 수치 (ex: 4.8)" onChange={handleTansoChange} value={product.extra.tanso} />

        {/* 파일 업로드 섹션 */}
        <div>
          {/* 기존의 input type= file 요소를 숨기고 ref 속성을 통해 fileInputRef에 연결 */}
          <input type="file" ref={fileInputRef} name="image" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />

          {/* 커스텀 파일 선택 버튼 생성 - 버튼 혹은 라벨 클릭시 fileInputRef를 통헤 
          숨겨진 파일 입력의 click 메소드 호출 */}
          <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
            파일 선택
          </button>
        </div>
        {/* 미리보기 영역 - 썸네일 표시 */}
        {renderImagePreview()}
        <textarea name="content" placeholder="상품 설명" onChange={handleChange} value={product.content} required />

        {/* 상품 추가, 수정 버튼 */}
        <button type="button" onClick={handleAddorUpdateProduct}>
          {editingIndex === null ? '상품 추가' : '수정 완료'}
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
              <td colSpan={9} className="border border-gray-300 p-4 text-center">
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
                        {idx === 0 && <span className="absolute top-0 left-0 bg-blue-500 text-white text-xl px-1 rounded">대표이미지</span>}
                        <img src={img.path} alt={`${item.name}-${idx}`} className="w-32 h-32 object-cover border border-gray-300" />
                      </div>
                    ))}
                  </div>
                </td>
                <td className="border border-gray-300 p-2">{item.name}</td>
                <td className="border border-gray-300 p-2">{item.quantity}</td>
                <td className="border border-gray-300 p-2">{item.price}원</td>
                <td className="border border-gray-300 p-2">{item.extra.tanso}</td>
                <td className="border border-gray-300 p-2">{item.extra.isNew ? '✔️' : '-'}</td>
                <td className="border border-gray-300 p-2">{item.extra.isBest ? '✔️' : '-'}</td>
                <td className="border border-gray-300 p-2">{getDisplayCategory(item.extra.category)}</td>

                <td className="border border-gray-300 p-2">
                  <button type="button" onClick={() => handleEditProduct(index)} className="text-blue-500 hover:underline mr-2">
                    수정
                  </button>
                  <button type="button" onClick={() => handleDeleteProduct(index)} className="text-red-500 hover:underline mr-2">
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50" onClick={handleCloseModal}>
          <div className="relative">
            <img src={modalImage.path} alt={modalImage.name} className="max-w-full max-h-screen" />
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

      <button type="submit" onClick={handleSubmit}>
        전체 상품 등록
      </button>
    </div>
  );
};

export default AdminProductUpload;
