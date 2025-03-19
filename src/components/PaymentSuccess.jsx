import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAxiosInstance from '@hooks/useAxiosInstance';
import { useQueryClient } from '@tanstack/react-query';
import useCartStore from '@store/cartStore';
import useUserStore from '@store/userStore';

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

      // 주문 생성 API 호출 (백엔드)
      // 여기서 Local Storage에 저장된 'cartItems'를 읽어와 주문 데이터의 products 필드로 사용.
      const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const orderData = {
        user_id: user.id, // 백엔드 문서 기준으로 user_id 사용
        orderId, // 결제창에서 생성된 주문 번호
        amount, // 결제 금액
        products: storedItems, // Local Storage에 저장된 장바구니 상품 배열
        cost: {
          // cost 계산: 제품 금액 총합, 배송비 등 (필요에 따라 수정)
          products: storedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          shippingFees: 2500,
          discount: { products: 0, shippingFees: 0 },
          total: storedItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 2500,
        },
        // user 데이터에서 사용자의 주소와 연락처를 가져옴
        address: {
          name: user.name,
          value: user.address || '기본 주소',
        },
        phone: user.phone,
        state: 'OS020', // 주문 상태 코드 (프로젝트별로 정의된 값)
      };

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
