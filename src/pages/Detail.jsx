import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useMenuStore from "../store/menuStore";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReviewList from "@pages/ReviewList";

import useCartStore from "../store/cartStore"; // Store import
import useUserStore from "@store/userStore"; // 사용자 저장소 import

function Detail() {
  const [activeTab, setActiveTab] = useState("가"); // 기본 활성 탭은 '가'
  const { id } = useParams(); // Get product ID from URL
  const axiosInstance = useAxiosInstance();
  const [cartItemsList, setCartItemsList] = useState([]);
  const navigate = useNavigate();
  const { user } = useUserStore(); // 사용자 정보 가져오기
  const { addToCart, fetchCartItems } = useCartStore();

  const handleAddToCart = async (product) => {
    console.log("Adding to cart:", product); // 추가되는 상품 확인
    const success = await addToCart(product);
    if (success) {
      alert("장바구니에 추가되었습니다!");
      await fetchCartItems(); // 장바구니 새로고침
      navigate(`/cart/${user.id}`); // userId를 포함한 경로로 변경
    } else {
      alert("장바구니에 아이템 추가 실패");
    }
  };

  const getImage = (path) => {
    const baseURL = "https://11.fesp.shop";
    return `${baseURL}${path}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        const product = response?.data?.item;
        product.quantity = 1; // Set quantity to 1
        setCartItemsList([product]);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  //❗qna 데이터를 불러옴
  const {
    data: qnas,
    isLoading: qnasLoading,
    error: qnasError,
  } = useQuery({
    queryKey: ["posts", "qna", "main"],
    queryFn: () =>
      axiosInstance.get("/posts", {
        params: {
          type: "qna",
          page: 1,
          limit: 5,
        },
      }),
    select: (res) => res.data.item,
    staleTime: 1000 * 60 * 5, // 데이터가 5분 동안 신선한 상태로 유지
    cacheTime: 1000 * 60 * 30, // 캐시를 30분 동안 유지
  });

  // //❗review 데이터를 불러옴
  // const {
  //   data: reviews,
  //   isLoading: reviewsLoading,
  //   error: reviewsError,
  // } = useQuery({
  //   queryKey: ["reviews", "main"], // 캐시 키
  //   queryFn: () =>
  //     axiosInstance.get(`/reviews`, {
  //       // 리뷰 데이터를 가져오는 API 호출
  //       params: {
  //         page: 1,
  //         limit: 5,
  //       },
  //     }),
  //   select: (res) => res.data.item, // 필요한 데이터를 선택
  //   staleTime: 1000 * 60 * 5, // 데이터가 5분 동안 신선한 상태로 유지
  //   cacheTime: 1000 * 60 * 30, // 캐시를 30분 동안 유지
  // });

  const [quantity, setQuantity] = useState(1); // 초기값 1로 설정
  const [productDetails, setProductDetails] = useState(null);

  const [tabContent, setTabContent] = useState({
    상세정보: (
      <div style={{ textAlign: "center" }}>
        <img
          src="/images/pencildetail.jpg"
          alt="상세정보 이미지"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
    ),
    구매안내: (
      <div>
        <p className="pl-[100px] pr-[100px] text-[18px]">
          고액결제의 경우 안전을 위해 카드사에서 확인전화를 드릴 수도 있습니다.
          확인과정에서 도난 카드의 사용이나 타인 명의의 주문등 정상적인 주문이
          아니라고 판단될 경우 임의로 주문을 보류 또는 취소할 수 있습니다.
          <br /> <br /> <br />
          무통장 입금은 상품 구매 대금은 PC뱅킹, 인터넷뱅킹, 텔레뱅킹 혹은
          가까운 은행에서 직접 입금하시면 됩니다. 주문시 입력한 입금자명과
          실제입금자의 성명이 반드시 일치하여야 하며, 7일 이내로 입금을 하셔야
          하며 입금되지 않은 주문은 자동취소 됩니다.
        </p>
      </div>
    ),
    상품후기: <ReviewList id={id} />,
    QnA: (
      <div className=" rounded-md overflow-hidden">
        <div className="flex justify-between items-center py-4 px-6 border-b border-gray-300">
          <h3 className="text-3xl font-bold ">Q&A </h3>

          <Link to="/qna"></Link>
        </div>
        <ul className="space-y-9 px-6 py-9 ">
          {qnas?.map((qna) => (
            <li
              key={qna._id}
              className=" border-b border-gray-300 flex justify-between items-center text-lg py-7"
            >
              <Link
                to={`/qna/detail/${qna._id}`}
                className=" text-[15px] text-gray-800 hover:underline"
              >
                {qna.image}
                {qna.title}
              </Link>
              <span className="text-gray-500">
                {qna.createdAt.split("T")[0]}
              </span>
            </li>
          ))}
          {qnas?.length === 0 && <p>Q&A가 없습니다.</p>}
        </ul>
      </div>
    ),
  });

  const dummyItems = [
    {
      id: 1,
      name: "상품 A",
      price: 15000,
      quantity: 1,
      image: "https://via.placeholder.com/80",
    },
  ];

  const shippingCost = 3000;
  const updateQuantity = (id, newQuantity) => {
    setCartItemsList((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const totalPrice = cartItemsList.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalOrderAmount = totalPrice + shippingCost; // 가격계산결과

  const { activeMenu, setActiveMenu } = useMenuStore();
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex justify-center px-[16px]">
      {/* 화면 가운데 정렬 및 좌우 패딩을 추가한 외부 컨테이너 */}
      <div
        className="container mx-auto px-[24px] my-[40px]"
        style={{ maxWidth: "1200px" }}
      >
        {" "}
        <div>
          {cartItemsList.map((item) => (
            <div className="flex ml-[80px] mt-[50px]" key={item._id}>
              <div className="flex flex-col mr-[30px]">
                {item?.mainImages?.map((image, index) => (
                  <img
                    key={index} // map() 사용 시 고유 key 필요
                    src={getImage(image.path)} // 경로 변환 함수 사용
                    alt={`상품 이미지 ${index + 1}`}
                    className="w-[80px] h-[90px] mb-[10px] object-cover mr-[32px]"
                  />
                ))}
              </div>
              <img
                src={getImage(item?.mainImages?.[0]?.path)}
                alt="메인 상품 이미지"
                className="w-[370px] h-[492px] mb-[20px] object-cover mr-[70px]"
              />

              <hr className="mt-[12px] mb-[16px]" />

              {/*🍓표 시작 */}
              <dl className="w-full">
                <p className="text-[18px] font-semibold mb-[20px] mt-[30px]">
                  {item.name}
                </p>
                <p className="text-[13px]  text-grey-80">상품설명</p>
                <hr className="mt-[12px] mb-[16px]" />

                <dl className="flex">
                  <dt className=" mr-[90px] mb-[16px]">판매가</dt>
                  <dd>{item?.price?.toLocaleString()}</dd>
                </dl>

                <dl className="flex">
                  <dt className=" mr-[30px] mb-[16px]">국내·해외배송 </dt>
                  <dd> 국내배송</dd>
                </dl>

                <dl className="flex">
                  <dt className=" mr-[90px] mb-[16px]">배송비 </dt>
                  <dd> 3,000원 (50,000원 이상 구매 시 무료)</dd>
                </dl>

                <dl className="flex">
                  <dt className=" mr-[90px] mb-[16px]">원산지</dt>
                  <dd> 국내</dd>
                </dl>

                <hr className="mt-[12px] mb-[16px]  " />

                {/* 장바구니 아이템들 */}
                {cartItemsList.map((item) => (
                  <div key={item.id} className="border-b py-[20px]">
                    <dd className="flex items-start py-[10px]">
                      {/* 상품 이름 */}

                      <div className="flex">
                        <h2 className="text-[15px] font-semibold text-grey-80 mr-[180px]">
                          {item.name}
                        </h2>

                        {/* 개수 증감 */}
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
                    <hr className="mt-[12px] mb-[1px]  " />

                    {/* 주문 금액 */}
                    <div className="flex">
                      <dt className=" py-[10px] text-[12px] mt-[1px] mr-[10px]">
                        총 상품 금액(수량):
                      </dt>
                      <dd className=" text-grey-80 font-gowunBold py-[10px] text-[21px]">
                        {totalPrice.toLocaleString()}원
                      </dd>
                      <dd className=" text-grey-80 font-gowunBold py-[10px] text-[12px] mt-[10px] ml-[10px]">
                        {item?.quantity?.toLocaleString()}개
                      </dd>
                    </div>
                    <div className="flex mb-[16px] mt-[70px] ">
                      <button
                        className="bg-white border-2 border-gray-300  w-[160px] py-[15px] mr-[10px] rounded-md text-[15px] text-center hover:bg-secondary-20 flex justify-center items-center"
                        onClick={() => alert("위시리스트에 추가하였습니다!")}
                      >
                        찜하기
                      </button>
                      <button
                        className="bg-white border-gray-300 border-2 w-[160px] py-[15px] mr-[10px] rounded-md text-[15px] text-center hover:bg-secondary-20 flex justify-center items-center"
                        onClick={() => handleAddToCart(item)}
                      >
                        장바구니
                      </button>
                      <button
                        className="bg-secondary-10 border-gray-300 border-2 w-[160px] py-[15px] mr-[10px] rounded-md text-[15px] text-center hover:bg-secondary-20 flex justify-center items-center"
                        onClick={() => alert("구매가 완료되었습니다!")}
                      >
                        구매하기
                      </button>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          ))}
          {/*🦋🍓*/}

          {/*👽제품상세 탭 */}
          <div>
            {/* 탭 네비게이션 */}
            <div className="flex mt-[80px] ">
              {["상세정보", "구매안내", "상품후기", "QnA"].map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)} // 탭 클릭 시 활성화된 탭을 변경
                  className={`w-[430px] pt-[20px] pb-[20px] cursor-pointer px-4 py-2 text-center text-[15px] 
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

            {/* 탭 콘텐츠 */}
            <div className="p-4 ml-[auto] mr-[auto] w-[1026px] mt-[100px] mb-[100px]">
              <p>{tabContent[activeTab]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
