// src/components/payment/PaymentSuccess.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function PaymentSuccess() {
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentKey = query.get('paymentKey');
    const orderId = query.get('orderId');
    const amount = query.get('amount');

    if (paymentKey && orderId && amount) {
      confirmPayment(paymentKey, orderId, amount);
    }
  }, [location]);

  const confirmPayment = async (paymentKey, orderId, amount) => {
    try {
      // 1) 시크릿 키 가져오기 (주의: 실제 배포 환경에서는 백엔드에서 해야 함)
      const SECRET_KEY = import.meta.env.VITE_TOSS_SECRET_KEY;
      const auth = btoa(`${SECRET_KEY}:`); // Basic 인코딩

      // 2) 토스 결제 승인 API 호출
      const response = await axios.post(
        'https://api.tosspayments.com/v1/payments/confirm',
        { paymentKey, orderId, amount },
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('결제 승인 성공:', response.data);
      alert('결제가 성공적으로 완료되었습니다!');
      // TODO: 여기에 DB 저장 로직이 필요하지만, 백엔드가 없으니 스킵
    } catch (error) {
      console.error('결제 승인 오류:', error.response?.data || error.message);
      alert('결제 승인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>결제 성공</h2>
      <p>결제 처리를 진행 중입니다...</p>
    </div>
  );
}

export default PaymentSuccess;
