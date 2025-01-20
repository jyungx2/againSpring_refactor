import { useEffect } from "react"; // React의 useEffect 훅을 임포트합니다.
import { useNavigate, useParams } from "react-router-dom"; // React Router의 useNavigate와 useParams 훅을 임포트합니다.
import { cartStore } from "../store/cartStore"; // 상태 관리를 위한 cartStore를 임포트합니다.
import useUserStore from "@store/userStore"; // 사용자 정보를 관리하는 userStore를 임포트합니다.
import { Helmet } from "react-helmet-async"; // Helmet을 사용하여 페이지의 head를 관리합니다.
import PurchaseButton from "@components/PurchaseButton"; // 구매 버튼 컴포넌트를 임포트합니다.

function Cart() {
  const { userId } = useParams(); // URL에서 userId를 가져옵니다.
  const {
    cartItemsList, // 장바구니에 담긴 아이템 목록
    shippingCost, // 배송비
    fetchCartItems, // 장바구니 아이템을 불러오는 함수
    loading, // 로딩 상태
    error, // 에러 상태
    updateItemQuantity, // 아이템 수량 업데이트 함수
    selectedItems, // 선택된 아이템 목록
    selectItem, // 아이템 선택 함수
    deselectItem, // 아이템 선택 해제 함수
    deleteSelectedItems, // 선택된 아이템 삭제 함수
    clearCart, // 장바구니 비우기 함수
  } = cartStore(); // cartStore에서 필요한 데이터와 함수를 가져옵니다.
  const { user } = useUserStore(); // 현재 로그인된 사용자 정보
  const navigate = useNavigate(); // 페이지 네비게이션 함수

  useEffect(() => {
    fetchCartItems(); // 장바구니 아이템 불러오기
  }, []);

  if (loading) return <div>Loading...</div>; // 로딩 중일 때 화면에 "Loading..." 표시
  if (error) return <div className="text-red-500">{error}</div>; // 에러가 발생하면 에러 메시지 표시

  return (
    <div className="flex justify-center">
      <div className="container w-[1200px] px-[16px] my-[40px]">
        <div className="flex items-center mb-[16px]">
          <h1 className="text-[24px] font-gowun text-grey-80 mr-[8px]">
            장바구니
          </h1>
          <span className="flex items-center justify-center w-[20px] h-[20px] bg-black bg-opacity-20 text-white rounded-full">
            {cartItemsList.length}
          </span>
        </div>
        <hr className="mb-0 border-t border-grey-20" />

        {cartItemsList.length === 0 ? (
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
                {cartItemsList.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="text-left">
                      <input
                        type="checkbox"
                        className="w-[16px] h-[16px] cursor-pointer"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)} // 체크박스를 클릭하면 해당 아이템 선택/해제
                      />
                    </td>
                    <td className="flex items-start py-[20px]">
                      <img
                        src={`https://11.fesp.shop${item.image}`}
                        alt={item.name}
                        className="w-[80px] h-[80px] object-cover mr-[8px]"
                      />
                      <div>
                        <p>{item.name}</p>
                        <p>{item.price}</p>
                      </div>
                    </td>
                    <td className="text-center">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItemQuantity(item.id, e.target.value)
                        }
                        className="w-[50px] text-center"
                      />
                    </td>
                    <td className="text-center">
                      {item.price * item.quantity}
                    </td>
                    <td className="text-center">{shippingCost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
