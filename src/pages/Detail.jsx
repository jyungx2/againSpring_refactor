// src/pages/Detail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import ReviewList from "@pages/ReviewList";
import useCartStore from "../store/cartStore";
import useUserStore from "@store/userStore";

function Detail() {
  const [activeTab, setActiveTab] = useState("상세정보");
  const { id } = useParams();
  const axiosInstance = useAxiosInstance();
  const [cartItemsList, setCartItemsList] = useState([]);
  const [productDetails, setProductDetails] = useState(null);
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { addToCart, fetchCartItems } = useCartStore();
  const [selectedIndex, setSelectedIndex] = useState(0); // 선택된 이미지 인덱스

  // 장바구니에 추가 후 Cart 페이지로 이동하는 함수
  const handleAddToCart = async (product) => {
    console.log("Adding to cart:", product);
    const success = await addToCart(product, 1);
    if (success) {
      alert("결제를 위해 장바구니로 이동합니다");
      await fetchCartItems();
      navigate(`/cart/${user.id}`);
    } else {
      alert("아이템 추가 실패");
    }
  };

  // 장바구니에 상품 추가만 하고 페이지 이동 X
  const handleAddToCartNoNav = async (product) => {
    console.log("Adding to Cart (페이지 이동 X):", product);
    const success = addToCart(product, 1);
    if (success) {
      alert("장바구니에 담겼습니다.");
      await fetchCartItems();
    } else {
      alert("아이템 추가 실패");
    }
  };

  // 위시리스트 추가
  const handleAddToWishlist = useMutation({
    mutationFn: () =>
      axiosInstance.post("/bookmarks/product", { target_id: parseInt(id) }),
    onSuccess: (res) => {
      if (res) {
        alert("위시리스트에 추가되었습니다!");
        navigate(`/wishlist`);
      } else {
        alert("위시리스트에 아이템 추가 실패");
      }
    },
  });

  // const getImage = (path) => {
  //   const baseURL = "https://fesp-api.koyeb.app/market";
  //   return `${baseURL}${path}`;
  // };

  useEffect(() => {
    console.log("typeof ID: ", typeof Number(id));
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${Number(id)}`);
        const product = response?.data?.item;
        console.log("detail: ", product);
        product.quantity = 1;
        setCartItemsList([product]); // 장바구니에 추가할 상품 목록 - 단일 상품이라도 배열로 저장
        setProductDetails(product); // 상품 상세 정보
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
    console.log(cartItemsList);
  }, [id]);

  // 관리자용 수정/ 삭제 기능
  const handleEdit = () => {
    if (!productDetails) {
      alert("상품 데이터가 없습니다.");
      return;
    }
    // 관리자가 상품 수정 페이지로 이동할 때, 현재 상품 상세 정보를 state로 전달
    navigate("/admin/product-edit", { state: productDetails });
  };

  // 삭제 버튼 클릭 시 호츌되는 함수
  const handledelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        // API 서버를 통해 상품 삭제 요청 (id 사용)
        await axiosInstance.delete(`/seller/products/${id}`, { data: { id } });
        alert("상품이 삭제 되었습니다.");
        navigate("/shop");
      } catch (error) {
        // 디버깅 확인 전용
        console.log("상품 삭제 실패:", error, response?.data || error.message);
        alert("상품 삭제에 실패하였습니다. 에러 메시지를 확인해주세요");
      }
    }
  };

  const {
    data: qnas,
    error: qnasError,
    isLoading: qnasLoading,
  } = useQuery({
    queryKey: ["posts", "qna", id],
    queryFn: () =>
      axiosInstance.get("/posts", {
        params: {
          type: "qna",
          page: 1,
          limit: 1000,
        },
      }),
    select: (res) => res.data.item,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });
  const filteredQnas = qnas?.filter((qna) => qna.product_id === parseInt(id));

  const [tabContent] = useState({
    구매안내: (
      <div className="grid grid-cols-2 gap-8 text-lg leading-relaxed">
        {/* 상품결제정보 */}
        <div className="border border-gray-300 p-6 rounded-md bg-white">
          <h2 className="font-semibold text-xl">PAYMENT INFO</h2>
          <h3 className="text-gray-500 mb-4">상품결제정보</h3>
          <p>
            고액결제의 경우 안전을 위해 카드사에서 확인전화를 드릴 수도
            있습니다. 확인 과정에서 도난 카드 사용이나 타인 명의의 주문 등
            정상적인 주문이 아니라고 판단될 경우 주문을 보류 또는 취소할 수
            있습니다.
            <br /> <br />
            무통장 입금은 상품 구매 대금을 PC뱅킹, 인터넷뱅킹, 텔레뱅킹 혹은
            가까운 은행에서 직접 입금하시면 됩니다. 주문 시 입력한 입금자명과
            실제 입금자명이 반드시 일치해야 하며, 7일 이내로 입금이 확인되지
            않을 경우 주문이 자동 취소됩니다.
          </p>
        </div>

        {/* 배송정보 */}
        <div className="border border-gray-300 p-6 rounded-md bg-white">
          <h2 className="font-semibold text-xl">DELIVERY INFO</h2>
          <h3 className="text-gray-500 mb-4">상품결제정보</h3>
          <p>
            배송 방법 : 택배
            <br />
            배송 지역 : 전국
            <br />
            배송 비용 : 3,000원
            <br />
            배송 기간 : 2일 ~ 7일
            <br />
            기타 배송 안내 : 택배사 사정에 따라 지연될 수 있습니다.
          </p>
        </div>

        {/* 교환 및 반품 정보 */}
        <div className="border border-gray-300 p-6 rounded-md bg-white">
          <h2 className="font-semibold text-xl">EXCHANGE INFO</h2>
          <h3 className="text-gray-500 mb-4">상품결제정보</h3>
          <p>
            교환 및 반품이 가능한 경우
            <br />
            1) 상품을 공급받은 날로부터 7일 이내 (포장을 개봉하였거나 포장이
            훼손되어 상품 가치가 상실된 경우 제외)
            <br />
            2) 공급받은 상품이 표시·광고 내용과 다르거나 다르게 이행된 경우
            <br />
            <br />
            교환 및 반품이 불가능한 경우
            <br />
            1) 고객의 책임 있는 사유로 상품 등이 분실·파손된 경우
            <br />
            2) 상품 개봉 후 가치가 훼손된 경우
          </p>
        </div>

        {/* 서비스문의*/}
        <div className="border border-gray-300 p-6 rounded-md bg-white">
          <h2 className="font-semibold text-xl">SERVICE INFO</h2>
          <h3 className="text-gray-500 mb-4">상품결제정보</h3>
          <p>
            상담 가능 시간 : AM 10:00 ~ PM 6:00 (주말, 공휴일 휴무)
            <br />
            점심시간 : PM 12:00 ~ PM 1:00
            <br />
            기타 문의사항은 고객센터로 연락 주시면 빠르게 도움 드리겠습니다.
          </p>
        </div>
      </div>
    ),
    상품후기: <ReviewList productId={id} />,
    // QnA 탭은 qnas 데이터를 사용
  });

  let formattedContent = "";

  if (productDetails && productDetails.content) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = productDetails.content;
    tempDiv.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (src && src.startsWith("/files/")) {
        img.setAttribute("src", `https://fesp-api.koyeb.app/market${src}`);
      }
    });

    formattedContent = tempDiv.innerHTML; // 변환된 HTML을 다시 문자열로 변환
  } else {
    formattedContent = "<p>Loading...</p>"; // 상품 상세정보가 없을 경우
  }
  const totalPrice = cartItemsList.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="flex justify-center px-[16px]">
      <div
        className="container mx-auto px-[24px] my-[40px]"
        style={{ maxWidth: "1200px" }}
      >
        {user?.type === "admin" && (
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">{`상품명: ${
              productDetails?.name || "상품 상세"
            }`}</h1>
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-primary-40 text-white rounded-md hover:bg-primary-60 transition-colors"
              >
                수정
              </button>
              <button
                onClick={handledelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        )}

        <div>
          {cartItemsList.map((item) => (
            <div className="flex mt-[50px]" key={item._id}>
              {/* 사이드 이미지  */}
              <div className="flex flex-col mr-[30px]">
                {item?.mainImages?.map((image, index) => (
                  <img
                    key={index}
                    src={image.path}
                    alt={`상품 이미지 ${index + 1}`}
                    className="w-[100px] h-[110px] mb-[10px] object-cover mr-[32px] cursor-pointer 
                    hover:border-2 opacity-100 hover:opacity-50 transition-opacity"
                    onClick={() => setSelectedIndex(index)} // 이미지 클릭 시 인덱스 변경
                  />
                ))}
              </div>

              {/* 메인 이미지 */}
              <img
                src={item?.mainImages?.[selectedIndex]?.path} // 선택된 이미지의 path
                alt="메인 상품 이미지"
                className="w-[370px] h-[492px] mb-[20px] object-cover mr-[70px]"
              />

              <hr className="mt-[12px] mb-[16px]" />

              <dl className="w-full">
                <p className="text-[18px] font-semibold mb-[20px] mt-[30px]">
                  {item.name}
                </p>
                <p className="text-[13px] text-grey-80">상품설명</p>
                <hr className="mt-[12px] mb-[16px]" />

                <dl className="flex">
                  <dt className="mr-[90px] mb-[16px]">판매가</dt>
                  <dd>{item?.price?.toLocaleString()}원</dd>
                </dl>

                <dl className="flex">
                  <dt className="mr-[30px] mb-[16px]">국내·해외배송</dt>
                  <dd>국내배송</dd>
                </dl>

                <dl className="flex">
                  <dt className="mr-[90px] mb-[16px]">배송비</dt>
                  <dd>3,000원 (50,000원 이상 구매 시 무료)</dd>
                </dl>

                <dl className="flex">
                  <dt className="mr-[90px] mb-[16px]">원산지</dt>
                  <dd>국내</dd>
                </dl>

                <hr className="mt-[12px] mb-[16px]" />

                {cartItemsList.map((item) => (
                  <div key={item.id} className="border-b py-[20px]">
                    <dd className="flex items-start py-[10px]">
                      <div className="flex">
                        <h2 className="text-[15px] font-semibold text-grey-80 mr-[180px]">
                          {item.name}
                        </h2>

                        <dd className="text-center py-[10px] mr-[60px]">
                          <div className="flex justify-center">
                            <div className="flex items-center h-[32px] border border-grey-20">
                              <button
                                className="w-[24px] h-full border-r border-grey-20 hover:bg-grey-10"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                              >
                                -
                              </button>
                              <span className="w-[50px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                className="w-[24px] h-full border-l border-grey-20 hover:bg-grey-10"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </dd>

                        <dd className="text-center py-[10px]">
                          {(item.price * item.quantity).toLocaleString()}원
                        </dd>
                      </div>
                    </dd>
                    <hr className="mt-[12px] mb-[1px]" />

                    <div className="flex">
                      <dt className="py-[10px] text-[12px] mt-[1px] mr-[10px]">
                        총 상품 금액(수량):
                      </dt>
                      <dd className="text-grey-80 font-gowunBold py-[10px] text-[21px]">
                        {totalPrice.toLocaleString()}원
                      </dd>
                      <dd className="text-grey-80 font-gowunBold py-[10px] text-[12px] mt-[10px] ml-[10px]">
                        {item?.quantity?.toLocaleString()}개
                      </dd>
                    </div>
                    <div className="flex justify-center mb-[16px] mt-[70px]">
                      <button
                        className="bg-white border-2 border-gray-300 w-[160px] py-[15px] mr-[10px] rounded-md text-[15px] text-center hover:bg-secondary-20 flex justify-center items-center"
                        onClick={handleAddToWishlist.mutate}
                      >
                        찜하기
                      </button>
                      <button
                        className="bg-white border-gray-300 border-2 w-[160px] py-[15px] mr-[10px] rounded-md text-[15px] text-center hover:bg-secondary-20 flex justify-center items-center"
                        onClick={() => handleAddToCartNoNav(item)}
                      >
                        장바구니 담기
                      </button>
                      {/* 구매하기 버튼: 단품 결제 관련 PurchaseButton 대신 handleAddToCart 호출 */}
                      <button
                        className="bg-white border-gray-300 border-2 w-[160px] py-[15px] mr-[10px] rounded-md text-[15px] text-center hover:bg-secondary-20 flex justify-center items-center"
                        onClick={() => handleAddToCart(item)}
                      >
                        구매하기
                      </button>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          ))}

          <div className="flex mt-[80px]">
            {["상세정보", "구매안내", "상품후기", "QnA"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 pt-[20px] pb-[20px] cursor-pointer px-4 text-center text-[15px] 
                ${
                  activeTab === tab
                    ? "border-t-3 border-l-3 border-r-3 bg-secondary-10 text-secondary-30 font-bold"
                    : "border-2 border-gray-300 text-gray-500"
                }`}
              >
                {tab}
              </div>
            ))}
          </div>

          <div className="p-4 w-full mx-auto mt-[100px] mb-[100px]">
            {/* // 상세정보 탭일 경우 상품 상세정보를 출력 - 조건부 랜더링 작업 (리뷰필요) */}
            {activeTab === "상세정보" ? (
              <div
                className="product-detail"
                dangerouslySetInnerHTML={{ __html: formattedContent }} // HTML을 렌더링하기 위해 dangerouslySetInnerHTML 사용하며 __html 키로 전달
              />
            ) : activeTab === "QnA" ? (
              // QnA 탭은 이제 최신 filteredQnas를 직접 사용해서 렌더링함 (디버깅적업 -  콘솔에서 qnas와 filteredQnas 확인됨)
              qnasLoading ? (
                <div>로딩 중...</div>
              ) : qnasError ? (
                <div>데이터를 불러오지 못했습니다.</div>
              ) : (
                <div className="rounded-md overflow-hidden">
                  <div className="flex justify-between items-center py-4 px-6 border-b border-gray-300">
                    <h3 className="text-3xl font-bold">Q&A</h3>
                    <Link to="/qna"></Link>
                  </div>
                  <ul className="space-y-9 px-6 py-9">
                    {filteredQnas?.map((qna) => (
                      <li
                        key={qna._id}
                        className="border-b border-gray-300 flex justify-between items-center text-lg py-7"
                      >
                        <Link
                          to={`/qna/detail/${qna._id}`}
                          className="text-[15px] text-gray-800 hover:underline"
                        >
                          {qna.image}
                          {qna.title}
                        </Link>
                        <span className="text-gray-500">
                          {qna.createdAt.split("T")[0]}
                        </span>
                      </li>
                    ))}
                    {filteredQnas?.length === 0 && <p>Q&A가 없습니다.</p>}
                  </ul>
                </div>
              )
            ) : activeTab === "상품후기" ? (
              <ReviewList productId={id} />
            ) : (
              <div>{tabContent[activeTab]}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
