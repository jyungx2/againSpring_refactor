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

  // 이미지 확대보기
  const handleViewImage = (img) => {
    console.log(img);
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
                    e.stopPropagation(); //
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

    // 상품 설명 최소 10자 검증 (이미 백엔드 로직에 구현되어있으나 프론트에서도 추가로 검증)
    if (product.content.length < 10) {
      // 상품 설명이 10자 미만이면
      alert('상품 설명은 최소 10자 이상 입력해야 합니다.'); // 경고 메시지 출력
      return;
    }

    // 상품 데이터
    const productData = {
      ...product, // ...product로 상품 정보 전달
      price: Number(product.price), // 가격, 수량, 배송비는 숫자로 변환
      quantity: Number(product.quantity), // 가격, 수량, 배송비는 숫자로 변환
      shippingFees: Number(product.shippingFees), // 가격, 수량, 배송비는 숫자로 변환
    };

    console.log('최종 변환된 보낼 데이터:', productData); // 콘솔에서 확인

    try {
      // 상품 등록 요청
      await addProduct(productData); // 상품 등록 API 호출
      alert('상품이 등록되었습니다!'); // 성공 메시지 출력
      navigator('/shop'); // 등록 후 상품 목록 페이지로 이동
    } catch (error) {
      // 상품 등록 실패 시
      console.error('상품 등록 실패:', error.response?.data || error.message); // 에러 메시지 출력
    }
  };

  return (
    <div>
      <h2>관리자 상품 등록 페이지</h2>
      <form onSubmit={handleSubmit}>
        {/* 텍스트 입력 필드 */}
        <input type="text" name="name" placeholder="상품명" onChange={handleChange} value={product.name} required />
        <input type="number" name="price" placeholder="가격" onChange={handleChange} value={product.price} required />
        <input type="number" name="quantity" placeholder="수량" onChange={handleChange} value={product.quantity} required />
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

        {/* 상품 등록된 목록 랜더 */}
        <h3>등록된 상품 목록</h3>
        {productList.length === 0 ? (
          <p>등록된 상품이 업습니다.</p>
        ) : (
          <ul>
            {productList.map((item, index) => (
              <li key={index}>
                <span>
                  {item.name} - {item.price}원
                </span>

                {/* 수정버튼 클릭시 해당 상품 데이터를 폼으로 이동 */}
                <button type="button" onClick={() => handleEditProduct(index)}>
                  수정
                </button>
                {/* 삭제 버튼 클릭시 해당 상품 제거 */}
                <button type="button" onClick={() => handleDeleteProduct(index)}>
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
        <button type="submit">전체 상품 등록</button>
      </form>
    </div>
  );
};

export default AdminProductUpload;
