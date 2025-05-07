import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Wishlist from "@pages/WishList";
import PurchaseButton from "@components/PurchaseButton";
import useAxiosInstance from "@hooks/useAxiosInstance";

function Cart() {
  const axios = useAxiosInstance();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🧾 1. 장바구니 불러오기
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("/carts");
        const items = res.data.item; // [{id, name, price, quantity}]
        setCartItems(items);
        setSelectedItems(items.map((item) => item._id)); // ✅ 처음엔 전체 선택
      } catch {
        alert("장바구니 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // ✅ 체크박스 개별 선택/해제
  const handleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ✅ 전체 선택/해제 토글
  const handleToggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item._id));
    }
  };

  // ✅ 선택 상품 삭제
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }

    const updated = cartItems.filter(
      (item) => !selectedItems.includes(item._id)
    );

    const confirmed = window.confirm("선택한 상품을 정말 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      // ✅ 각 선택된 항목을 순차적으로 삭제 요청
      // Promise.all()을 사용해서 비동기 병렬 처리로 삭제 요청을 동시에 보냄
      await Promise.all(
        selectedItems.map((_id) => axios.delete(`/carts/${_id}`))
      );

      // UI 동기화
      const updated = cartItems.filter(
        (item) => !selectedItems.includes(item._id)
      );
      setCartItems(updated);
      setSelectedItems([]);
      alert("선택한 상품이 삭제되었습니다.");
    } catch (err) {
      console.error(err);
      alert("상품 삭제에 실패했습니다.");
    }

    setCartItems(updated);
    setSelectedItems([]); // 선택 초기화
  };

  // ✅ 수량 변경
  const handleQuantityChange = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleCleanup = async () => {
    try {
      const res = await axios.delete("/carts/cleanup");
      console.log(res.status);
      setCartItems([]);
      setSelectedItems([]);
      alert("모든 상품을 삭제했습니다.");
    } catch (err) {
      console.error(err);
      alert("전체 상품 삭제에 실패했습니다.");
    }
  };

  // ✅ 금액 계산 (선택된 상품만)
  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item._id))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // ✅ 총액 3만원 이상이면 배송비 0원
  const shippingCost =
    totalPrice >= 30000 || selectedItems.length === 0 ? 0 : 2500;

  if (loading) return <div>로딩 중...</div>;

  const handleOrderAgain = () => {
    navigate("/");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex justify-center">
      <div className="container w-[1200px] px-[16px] my-[40px]">
        <Helmet>
          <title>다시, 봄 장바구니</title>
          <meta
            name="description"
            content="장바구니에 담긴 상품을 확인하세요."
          />
        </Helmet>

        <div className="flex items-center mb-[16px]">
          <h1 className="text-[24px] font-gowun text-grey-80 mr-[8px]">
            장바구니
          </h1>
          <span className="flex items-center justify-center w-[20px] h-[20px] bg-black bg-opacity-20 text-white rounded-full">
            {cartItems.length}
          </span>
        </div>
        <hr className="mb-0 border-t border-grey-20" />

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[256px]">
            <img
              src="/images/Cart1.png"
              alt="Empty Cart"
              className="w-[52px] h-[52px] mb-[20px]"
            />
            <p className="text-[18px] font-gowun text-grey-40">
              장바구니가 비어있습니다.
            </p>
          </div>
        ) : (
          <div>
            <table className="w-full table-auto">
              <thead>
                <tr className="font-semibold border-b">
                  <th className="w-[2%] text-left py-[20px]"></th>
                  <th className="w-[62%] text-left py-[20px] font-gowun text-grey-40 text-[14px]">
                    상품 정보
                  </th>
                  <th className="w-[12%] text-center py-[20px] font-gowun text-grey-40 text-[14px]">
                    수량
                  </th>
                  <th className="w-[12%] text-center py-[20px] font-gowun text-grey-40 text-[14px]">
                    주문 금액
                  </th>
                  <th className="w-[12%] text-center py-[20px] font-gowun text-grey-40 text-[14px]">
                    배송 정보
                  </th>
                </tr>
              </thead>

              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="text-left">
                      <input
                        type="checkbox"
                        className="w-[16px] h-[16px] cursor-pointer"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => handleSelect(item._id)}
                      />
                    </td>
                    <td className="flex items-start py-[20px]">
                      <img
                        src={`https://11.fesp.shop${item.product.image.path}`}
                        alt={item.name}
                        className="w-[80px] h-[80px] object-cover mr-[8px]"
                      />
                      <div>
                        <h2 className="text-[15px] font-semibold text-grey-80">
                          {item.product.name}
                        </h2>
                      </div>
                    </td>
                    <td className="text-center py-[20px] border-l border-grey-20">
                      <div className="flex justify-center h-full">
                        <div className="flex items-center h-[32px] border border-grey-20">
                          <button
                            className={`w-[24px] h-full border-r border-grey-20 ${
                              item.quantity <= 1
                                ? "opacity-50"
                                : "hover:bg-grey-10"
                            }`}
                            onClick={() =>
                              item.quantity > 1 &&
                              handleQuantityChange(item._id, -1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-[50px] h-full flex items-center justify-center border-grey-200 text-black text-[12px]">
                            {item.quantity}
                          </span>
                          <button
                            className="w-[24px] h-full border-l border-grey-20 hover:bg-grey-10"
                            onClick={() => handleQuantityChange(item._id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="text-center text-grey-80 font-gowunBold py-[20px] border-l border-grey-20 text-[20px]">
                      {(item.product.price * item.quantity).toLocaleString()}원
                    </td>
                    <td className="text-center text-grey-80 font-gowunBold py-[20px] border-l border-grey-20">
                      <div className="text-[16px]">2,500원</div>
                      <div className="text-[13px] font-gowun text-grey-40">
                        택배
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr className="mb-[12px]" />

            <div className="flex justify-start mb-[40px]">
              <button
                className="bg-white text-black py-[8px] px-[12px] font-[12px] font-gowunBold border border-grey-40 text-[14px] hover:bg-grey-30 mr-[8px]"
                onClick={handleToggleSelectAll}
              >
                전체 선택
              </button>
              <button
                className="bg-white text-black py-[8px] px-[12px] font-[12px] font-gowunBold border border-grey-40 text-[14px] hover:bg-grey-30 mr-[8px]"
                onClick={handleDeleteSelected}
              >
                선택 상품 삭제
              </button>
              <button
                className="bg-white text-black py-[8px] px-[12px] font-[12px] font-gowunBold border border-grey-40 text-[14px] hover:bg-grey-30 mr-[8px]"
                onClick={handleCleanup}
              >
                장바구니 비우기
              </button>
            </div>

            <hr className="mb-[12px] border-grey-50" />

            <div className="flex justify-between">
              <p className="text-[14px] font-gowun">
                총 선택 상품{" "}
                <span className="text-secondary-40 font-gowunBold">
                  {selectedItems.length}
                </span>
                개
              </p>
            </div>

            <hr className="mt-[12px] mb-[16px]" />

            <div className="grid grid-cols-[repeat(5,auto)] justify-center gap-[4px] mb-[16px] items-center">
              <div className="flex flex-col items-center gap-2">
                <div className="text-[18px] font-gowunBold">
                  {totalPrice.toLocaleString()}원
                </div>
                <div className="text-[12px] font-gowun text-grey-50">
                  상품 금액
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-[18px] font-bold px-[20px]">+</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-[18px] font-gowunBold">
                  {selectedItems.length === 0
                    ? 0
                    : shippingCost.toLocaleString()}
                  원
                </div>
                <div className="items-center justify-center text-[12px] font-gowun text-grey-50">
                  배송비 (30,000원 이상 무료배송)
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-[18px] font-bold px-[20px]">=</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-[18px] font-bold">
                  {(totalPrice + shippingCost).toLocaleString()}원
                </div>
                <div className="text-[12px] font-gowun text-grey-50">
                  총 주문 금액
                </div>
              </div>
            </div>

            <hr className="my-[16px] border-grey-50" />

            <div className="flex justify-center mb-[16px]">
              <div className="flex justify-center mb-[16px]">
                <PurchaseButton
                  products={cartItems.filter((item) =>
                    selectedItems.includes(item._id)
                  )}
                  className="bg-primary-40 text-white w-[280px] py-[8px] rounded-md text-[15px] text-center hover:bg-primary-50"
                />
              </div>
            </div>

            <div className="mt-[8px] flex justify-center">
              <button
                className="text-black text-[15px] border-b border-grey-40"
                onClick={handleOrderAgain}
              >
                다음에 다시 주문하기
              </button>
            </div>
          </div>
        )}
        <hr className="mt-[12px] mb-[16px]" />

        <Wishlist />
      </div>
    </div>
  );
}

export default Cart;
