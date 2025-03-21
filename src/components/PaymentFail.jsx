// src/components/payment/PaymentFail.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

function PaymentFail() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const code = query.get('code');
  const message = query.get('message');

  return (
    <div style={{ padding: '20px' }}>
      <h2>결제 실패</h2>
      <p>에러 코드: {code}</p>
      <p>에러 메시지: {message}</p>
    </div>
  );
}

export default PaymentFail;
