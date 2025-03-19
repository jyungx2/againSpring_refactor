export function calculateShippingFee(cartItems) {
  // 장바구니가 비었으면 배송비 0원
  if (!cartItems || cartItems.length === 0) {
    return 0;
  }

  //여러 상품이 있어도 가장 높은 배송비 한번만 적용 (최대값만)
  // 상품마다 배송비가 3천원 동일할경우 -최종 결제 배송비 3천원
  const maxFee = Math.max(...cartItems.map((item) => item.shippingFee || 0));
  return maxFee;
}
