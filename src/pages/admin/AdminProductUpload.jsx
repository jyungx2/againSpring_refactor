import { useState } from 'react';
import useProductApi from '@hooks/useAddProduct';

const AdminProductUpload = () => {
  // 관리자 상품 등록 페이지
  const { addProduct } = useProductApi(); // 상품 등록 API 호출
  const [product, setProduct] = useState({
    // 상품 정보 상태
    name: '',
    price: '',
    quantity: '',
    shippingFees: '',
    mainImages: [],
    content: '',
    extra: {},
  });

  // 인풋 값 변경 이벤트 핸들러
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value }); // 상품 정보 업데이트
  };

  // 이미지 변경 이벤트 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // 파일 객체 가져오기
    if (file) {
      // 파일이 존재하면
      const newImage = {
        // 이미지 정보 객체 생성
        path: URL.createObjectURL(file), // 이미지 경로
        name: file.name, // 이미지 이름
        originalname: file.name, // 이미지 원본 이름
      };
      setProduct({ ...product, mainImages: [newImage] }); // 상품 정보 업데이트
    }
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
      alert('상품 등록 실패'); // 실패 메시지 출력
    }
  };

  return (
    <div>
      <h2>관리자 상품 등록 페이지</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="상품명" onChange={handleChange} required />
        <input type="number" name="price" placeholder="가격" onChange={handleChange} required />
        <input type="number" name="quantity" placeholder="수량" onChange={handleChange} required />
        <input type="number" name="shippingFees" placeholder="배송비" onChange={handleChange} />
        <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
        <textarea name="content" placeholder="상품 설명" onChange={handleChange} required />
        <button type="submit">상품 등록</button>
      </form>
    </div>
  );
};

export default AdminProductUpload;
