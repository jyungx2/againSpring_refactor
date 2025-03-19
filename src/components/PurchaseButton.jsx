// src/components/PurchaseButton.jsx
import React from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';

function PurchaseButton({ products, className, children }) {
  // 구매하기 버튼 클릭 시
  const handlePurchase = async () => {
    try {
      const tossPayments = await loadTossPayments(import.meta.env.VITE_TOSS_CLIENT_KEY);

      // 총 결제 금액 계산
      const totalAmount = products.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

      // 주문명: 여러 상품이면 "첫 상품명 외 N건"
      let orderName = '';
      if (products.length === 1) {
        orderName = products[0].name;
      } else {
        orderName = `${products[0].name} 외 ${products.length - 1}건`;
      }

      await tossPayments.requestPayment('카드', {
        amount: totalAmount,
        orderId: `ORDER_${Date.now()}`,
        orderName,
        customerName: '테스트사용자', // 실제로는 userStore 등에서 가져오기
        successUrl: import.meta.env.VITE_TOSS_SUCCESS_URL,
        failUrl: import.meta.env.VITE_TOSS_FAIL_URL,
      });
    } catch (error) {
      console.error('결제창 오류:', error);
      alert('결제창 호출 중 오류가 발생했습니다.');
    }
  };

  return (
    <button className={className} onClick={handlePurchase}>
      {children || '구매하기'}
    </button>
  );
}

export default PurchaseButton;
