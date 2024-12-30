import { useState } from "react";

function Cart() {
  const [cartItemsList, setCartItemsList] = useState([
    {
      id: 1,
      name: "상품 A",
      price: 15000,
      quantity: 1,
      shippingCost: 3000,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "상품 B",
      price: 25000,
      quantity: 2,
      shippingCost: 4000,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "상품 C",
      price: 10000,
      quantity: 1,
      shippingCost: 2500,
      image: "https://via.placeholder.com/150",
    },
  ]);

  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const deleteSelectedItems = () => {
    setCartItemsList(
      cartItemsList.filter((item) => !selectedItems.includes(item.id))
    );
    setSelectedItems([]);
  };

  const maxShippingCost = Math.max(
    ...cartItemsList.map((item) => item.shippingCost),
    0
  );

  const totalPrice = cartItemsList.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalOrderAmount = totalPrice + maxShippingCost;

  return (
    <div className="flex justify-center">
      <div className="max-w-[1520px] w-full mx-auto">
        <div className="flex items-center mb-[16px]">
          <h1 className="text-[24px] font-bold text-[#363636] mr-[8px]">
            장바구니
          </h1>
          <span className="flex items-center justify-center w-[32px] h-[32px] bg-black bg-opacity-20 text-white rounded-full">
            {cartItemsList.length}
          </span>
        </div>

        <hr className="mb-0 border-t border-gray-300" />

        {cartItemsList.length === 0 ? (
          <div className="flex items-center justify-center h-[256px]">
            <p className="text-[18px]">장바구니에 상품이 없습니다.</p>
          </div>
        ) : (
          <div>
            <table className="w-full table-auto">
              <thead>
                <tr className="font-semibold border-b">
                  <th className="w-[4%] text-center py-[20px]">
                    <input
                      type="checkbox"
                      className="appearance-none w-[16px] h-[16px] border border-gray-400 rounded cursor-pointer checked:bg-blue-500"
                    />
                  </th>
                  <th className="w-[60%] text-left py-[20px] text-[#363636] opacity-60 text-[14px]">
                    상품 정보
                  </th>
                  <th className="w-[12%] text-center py-[20px] text-[#363636] opacity-60 text-[14px]">
                    수량
                  </th>
                  <th className="w-[12%] text-center py-[20px] text-[#363636] opacity-60 text-[14px]">
                    주문 금액
                  </th>
                  <th className="w-[12%] text-center py-[20px] text-[#363636] opacity-60 text-[14px]">
                    배송 정보
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItemsList.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="appearance-none w-[16px] h-[16px] border border-gray-400 rounded cursor-pointer checked:bg-blue-500"
                      />
                    </td>
                    <td className="flex items-start py-[20px]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-[64px] h-[64px] object-cover mr-[8px]"
                      />
                      <div>
                        <h2 className="text-[14px] font-semibold text-[#363636]">
                          {item.name}
                        </h2>
                      </div>
                    </td>
                    <td className="text-center py-[20px] border-l border-gray-300">
                      <div className="flex justify-center h-full">
                        <div className="flex items-center h-[32px] border border-gray-300">
                          <button className="w-[24px] h-full border-r border-gray-300 hover:bg-gray-200">
                            -
                          </button>
                          <span className="w-[50px] h-full flex items-center justify-center border-gray-300">
                            {item.quantity}
                          </span>
                          <button className="w-[24px] h-full border-l border-gray-300 hover:bg-gray-200">
                            +
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-[20px] border-l border-gray-300">
                      {item.price * item.quantity} 원
                    </td>
                    <td className="text-center py-[20px] border-l border-gray-300">
                      {item.shippingCost} 원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between my-[16px]">
              <div className="flex space-x-[8px]">
                <button
                  onClick={deleteSelectedItems}
                  className="bg-white text-[#363636] border border-gray-300 hover:bg-gray-200 px-4 py-2"
                >
                  선택상품 삭제
                </button>
                <button className="bg-white text-[#363636] border border-gray-300 hover:bg-gray-200 px-4 py-2">
                  품절상품 삭제
                </button>
              </div>
              <p className="text-[12px] text-gray-600 mt-[8px] text-right">
                결제 시 추가 할인 적용에 따라 배송비가 변경될 수 있습니다.
              </p>
            </div>

            <hr className="my-[16px]" />

            <div className="flex justify-between">
              <p className="text-[18px]">
                총 주문 상품 {cartItemsList.length}개
              </p>
            </div>

            <hr className="my-[16px]" />

            <div className="grid grid-cols-5 gap-[4px] text-center mb-[16px]">
              <div className="flex flex-col items-center">
                <div className="text-[18px] font-bold">{totalPrice} 원</div>
                <div className="text-[12px] text-gray-600">상품 금액</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-[18px] font-bold">+</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-[18px] font-bold">
                  {maxShippingCost} 원
                </div>
                <div className="text-[12px] text-gray-600">배송비</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-[18px] font-bold">=</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-[18px] font-bold">
                  {totalOrderAmount} 원
                </div>
                <div className="text-[12px] text-gray-600">총 주문 금액</div>
              </div>
            </div>

            <hr className="my-[16px]" />

            <div className="flex justify-center mb-[16px]">
              <button className="bg-[#90be6d] text-[#ffffff] w-[280px] py-[8px] rounded-md text-[15px] text-center hover:bg-[#7cae5b]">
                주문하기
              </button>
            </div>

            <div className="mt-[8px] text-center">
              <button className="text-black-500">다음에 다시 주문하기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
