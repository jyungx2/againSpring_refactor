// src/routes/paymentRoutes.jsx
import PaymentSuccess from '@components/PaymentSuccess';
import PaymentFail from '@components/PaymentFail';

const paymentRoutes = [
  { path: 'payment/success', element: <PaymentSuccess /> },
  { path: 'payment/fail', element: <PaymentFail /> },
];

export default paymentRoutes;
