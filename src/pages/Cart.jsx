import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Wishlist from "@pages/WishList";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function Cart() {
  const queryClient = useQueryClient();
  const axios = useAxiosInstance();
  // const [cartItems, setCartItems] = useState([]); // (useEffect+useState) 조합 대신, useQuery로 상태관리하면 필요없다!

  // ✅ 체크된 상품 객체 배열 (UI 전용 상태)
  const [selectedItems, setSelectedItems] = useState([]);
  // const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isInitialLoad = useRef(true);
  const navigate = useNavigate();

  // 🧾 1. 장바구니 불러오기
  // ✅ useEffect 대신, useQuery를 사용해 캐싱기능 자동화!
  // useEffect(() => {
  //   const fetchCart = async () => {
  //     try {
  //       const res = await axios.get("/carts");
  //       const items = res.data.item; // [{id, name, price, quantity}]
  //       setCartItems(items);
  //       setSelectedItems(items.map((item) => item._id)); // ✅ 처음엔 전체 선택
  //     } catch {
  //       alert("장바구니 불러오기 실패");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCart();
  // }, []);

  // ✅ 장바구니 데이터 가져오기 (React Query에서 관리)
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      try {
        const res = await axios.get("/carts");
        const items = res.data.item; // 장바구니에 들어가있는 상품 배열
        // setSelectedItems([...items]);

        return items; // 여기서 리턴한 items(useQuery 내부에서 관리된 캐시 값)가 곧 반환되는 data가 되므로, 굳이 별도로 useState로 상태관리 할 필요 X => 불필요한 useState 제거 가능
      } catch {
        alert("장바구니 불러오기 실패");
      }
    },
  });
  console.log("cartItems: ", cartItems);
  console.log("selectedItems: ", selectedItems);

  // ❗처음 cartItems 로딩됐을 때 한 번만 실행
  useEffect(() => {
    console.log("🧪 cartItems: ", cartItems);
    console.log("✅ didInit.current: ", isInitialLoad.current);

    if (cartItems.length > 0 && isInitialLoad.current) {
      setSelectedItems([...cartItems]);
      isInitialLoad.current = false; // ❓useState의 setter 함수 대신, useRef를 사용한 이유: setState(실행되는 순간 컴포넌트 렌더링 유발)와 다르게 useRef는 값이 바뀌어도 리렌더를 유발하지 않음 ==> 단순히 값을 기억하는 데에만 사용하기 때문에 성능상 안전하고 간결 => 렌더링과 무관한 상태를 추적할 때 가장 적합
      // ✅ 최초 렌더링 이후 조건문에 걸려 isInitialLoad === false로 바뀌므로, 더이상 조건문에 걸리지 않아 무한루프에 걸리진 않지만, 불필요한 렌더링 발생시킬 가능성 있기 때문에 useRef()가 더 적합..
    }
  }, [cartItems]);

  // ✅ 체크박스 개별 선택/해제
  const handleSelect = (id) => {
    setSelectedItems((prev) => {
      const exists = prev.find((item) => item._id === id);
      return exists
        ? prev.filter((item) => item._id !== id)
        : [...prev, cartItems.find((item) => item._id === id)];
    });
  };

  // ✅ 전체 선택/해제 토글
  const handleToggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...cartItems]);
    }
  };

  // ✅ 장바구니 아이템 개별 삭제 mutation
  const deleteCartMutation = useMutation({
    mutationFn: async (_id) => {
      const res = await axios.delete(`/carts/${_id}`);
      return res.data;
    },
    onSuccess: () => {
      // ✅ 삭제 성공 시 캐시 무효화 (서버에서 fresh한 장바구니 다시 불러오게)
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      alert("삭제 실패 😢");
    },
  });

  // ✅ 선택 상품 삭제
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }

    const confirmed = window.confirm("선택한 상품을 정말 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      // ✅ 각 선택된 항목을 순차적으로 삭제 요청
      // Promise.all()을 사용해서 비동기 병렬 처리로 삭제 요청을 동시에 보냄
      await Promise.all(
        selectedItems.map((item) => deleteCartMutation.mutateAsync(item._id))
      );

      // UI 동기화
      // const updated = cartItems.filter(
      //   (item) => !selectedItems.includes(item._id)
      // );
      // setCartItems(updated);
      // setSelectedItems([]);
      alert("선택한 상품이 삭제되었습니다.");
    } catch (err) {
      console.error(err);
      alert("상품 삭제에 실패했습니다.");
    }
  };

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }) => {
      return await axios.patch(`/carts/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] }); // 서버에서 최신 cart 다시 불러옴
    },
    onError: () => {
      alert("수량 변경 실패 😢");
    },
  });

  // ✅ 수량 변경
  // 1. cartItems 상태를 직접 수정하지 않고, 서버 상태가 단일 진실의 출처(Single Source of Truth) 가 됨
  // 2. 캐시 자동 관리 (invalidateQueries)
  // 3. 수량 변경이 서버에도 동기화되어 여러 탭이나 새로고침 시 일관된 동작
  const handleQuantityChange = (id, delta) => {
    const item = cartItems.find((item) => item._id === id);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + delta);
    updateQuantityMutation.mutate({ id, quantity: newQuantity });
  };

  // ✅ 장바구니 전체 삭제 Mutation
  const cleanupCartMutation = useMutation({
    mutationFn: async () => {
      return await axios.delete("/carts/cleanup");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] }); // 서버 데이터 새로고침
      setSelectedItems([]); // UI 선택 상태 초기화
      alert("모든 상품을 삭제했습니다.");
    },
    onError: (err) => {
      console.error(err);
      alert("전체 상품 삭제에 실패했습니다.");
    },
  });

  // ✅ 금액 계산 (선택된 상품만)
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // ✅ 배송비 계산 (3만원 이상 무료배송 + 아무것도 선택 안하면 0원)
  const shippingCost =
    totalPrice >= 30000 || selectedItems.length === 0 ? 0 : 2500;

  const handleOrderAgain = () => {
    navigate("/");
  };

  // 💥💥💥모든 훅 먼저 선언한 뒤, 아래 조건 분기 (렌더링 제어)💥💥💥
  // ⭐️ 리액트 훅(useQuery, useMutation, useState 등)은 컴포넌트 함수가 실행될 때마다 항상 똑같은 순서로 호출되어야 해.
  // 그래서 훅 선언보다 먼저 return을 하게 되면, 어떤 렌더에서는 훅이 실행되고, 다음 렌더에서는 return이 먼저 되면서 훅이 실행되지 않는 문제가 생겨.⭐️
  if (isLoading) return <div>장바구니 목록 가져오는 중...</div>;

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
          <h1 className="text-[24px] font-bold text-grey-80 mr-[8px]">
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
                        checked={selectedItems.some(
                          (selected) => selected.product_id === item.product_id
                        )}
                        onChange={() => handleSelect(item._id)}
                      />
                    </td>
                    <td className="flex items-start py-[20px]">
                      <img
                        src={item.product?.image?.path}
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
                onClick={() => cleanupCartMutation.mutate()}
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
                <button
                  onClick={() =>
                    navigate("/checkout", {
                      state: { cartItems: selectedItems, shippingCost: 2500 },
                    })
                  }
                  className="bg-primary-40 text-white w-[280px] py-[8px] rounded-md text-[1.5rem] text-center hover:bg-primary-50"
                >
                  구매하기
                </button>
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
