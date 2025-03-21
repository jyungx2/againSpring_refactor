import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAxiosInstance from '@hooks/useAxiosInstance';
import { useQueryClient } from '@tanstack/react-query';
import useCartStore from '@store/cartStore';
import useUserStore from '@store/userStore';
// import { calculateShippingFee } from '@utils/calculateShippingFee';

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axiosInstance = useAxiosInstance();
  const { clearCart } = useCartStore();
  const { user } = useUserStore();

  useEffect(() => {
    // URL에서 paymentKey, orderId, amount 쿼리 파라미터를 읽어옴
    const query = new URLSearchParams(location.search);
    const paymentKey = query.get('paymentKey');
    const orderId = query.get('orderId');
    const amount = query.get('amount');

    // 모든 값이 있을 때 결제 승인진행
    if (paymentKey && orderId && amount) {
      confirmPayment(paymentKey, orderId, amount);
    }
  }, [location]);

  const confirmPayment = async (paymentKey, orderId, amount) => {
    try {
      // 디버깅: 결제 승인 시 사용될 orderId, amount, paymentKey를 콘솔에 출력
      // console.log('confirmPayment orderId:', orderId, 'amount:', amount, 'paymentKey:', paymentKey);

      // 토스 결제 승인 API 호출
      const SECRET_KEY = import.meta.env.VITE_TOSS_SECRET_KEY;
      const auth = btoa(`${SECRET_KEY}:`);
      const confirmResponse = await axios.post(
        'https://api.tosspayments.com/v1/payments/confirm',
        { paymentKey, orderId, amount },
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('결제 승인 성공:', confirmResponse.data);

      // localStorage에서 cartItems를 읽어옴
      let storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      // 상품, 배송비 로직 통합
      const productCost = storedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      // const shippingFee = calculateShippingFee(storedItems);\
      const query = new URLSearchParams(location.search);
      const shippingFeeParam = query.get('shippingFee');
      const shippingFee = parseInt(shippingFeeParam, 10) || 0;

      const totalCost = productCost + shippingFee;
      // 단일 객체인 경우 배열로 감싸기
      if (!Array.isArray(storedItems)) {
        storedItems = [storedItems];
      }

      // 백엔드는 각 상품의 _id 필드(정수)를 요구합니다.
      // 기존에 product_id 필드 대신, _id 필드로 보내야 합니다.
      const productsArray = storedItems.map((item) => ({
        _id: parseInt(item.id, 10), // item.id를 정수로 변환 (백엔드가 정수만 허용)
        quantity: parseInt(item.quantity, 10),
      }));

      const parsedAmount = parseInt(amount, 10);

      // 주문 데이터: 백엔드 문서에 맞춰 최소 필드만 전송
      const orderData = {
        user_id: parseInt(user.id, 10),
        orderId,
        amount: parsedAmount,
        // 필드명을 백엔드 문서에 따라 "products" 배열로 전송 (각 원소는 { _id, quantity })
        products: productsArray,
        cost: {
          // cost 계산: 제품 금액 총합, 배송비 등 (필요에 따라 수정)
          products: productCost,
          shippingFees: shippingFee,
          discount: { products: 0, shippingFees: 0 },
          total: totalCost,
        },
        // user 데이터에서 사용자의 주소와 연락처를 가져옴
        address: {
          name: user.name,
          value: user.address || '기본 주소',
        },
        phone: user.phone,
        state: 'OS020', // 주문 상태 코드 (프로젝트별로 정의된 값)
      };

      console.log('전송할 orderData:', JSON.stringify(orderData, null, 2));

      const orderResponse = await axiosInstance.post('/orders', orderData);
      console.log('주문 생성 성공:', orderResponse.data);

      // 주문 목록 쿼리 무효화하여 마이페이지에 최신 주문 내역 반영
      queryClient.invalidateQueries(['orders']);

      clearCart(); // 주문 생성 후 장바구니 비우기

      alert('결제가 성공적으로 완료되었습니다!');

      navigate('/user/order'); // 결제가 끝나면 마이페이지(주문 목록)로 이동
    } catch (error) {
      console.error('결제 승인 오류:', error.response?.data || error.message);
      alert('결제 승인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>결제 처리 중... 잠시만 기다려주세요.</h2>
    </div>
  );
}

export default PaymentSuccess;
