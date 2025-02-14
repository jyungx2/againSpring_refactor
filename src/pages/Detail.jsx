import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { Link } from "react-router-dom";
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

  const handleAddToCart = async (product) => {
    console.log("Adding to cart:", product);
    const success = await addToCart(product, 1);
    if (success) {
      alert("장바구니에 추가되었습니다!");
      await fetchCartItems();
      navigate(`/cart/${user.id}`);
    } else {
      alert("아이템 추가 실패");
    }
  };

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

  const getImage = (path) => {
    const baseURL = "https://11.fesp.shop";
    return `${baseURL}${path}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        const product = response?.data?.item;
        product.quantity = 1;
        setCartItemsList([product]); // 장바구니에 추가할 상품 목록
        setProductDetails(product); // 상품 상세 정보
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  // const currentProductName = cartItemsList[0]?.name || "";

  const {
    data: qnas,
  } = useQuery({
    queryKey: ["posts", "qna", id],
    queryFn: () =>
      axiosInstance.get("/posts", {
        params: {
          type: "qna",
          // Here, we fetch all QnA posts
          page: 1,
          limit: 1000, // Set a high limit to fetch all QnA posts
        },
      }),
    select: (res) => res.data.item,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });

  // 콘솔에 QnA 포스트들의 상품 ID 출력
  useEffect(() => {
    if (qnas) {
      console.log(
        "QnA 포스트들의 상품 ID:",
        qnas.map((qna) => qna.product_id)
      );
    }
  }, [qnas]);

  // 상품 ID가 20인 QnA만 필터링
  const filteredQnas = qnas?.filter((qna) => qna.product_id === parseInt(id));

  // const [quantity, setQuantity] = useState(1);
  // const [productDetails, setProductDetails] = useState(null);

  const [tabContent] = useState({
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
    상품후기: <ReviewList productId={id} />,
    QnA: (
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
    ),
  });

  // const shippingCost = 3000;
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

  // const totalOrderAmount = totalPrice + shippingCost;
  // const { activeMenu, setActiveMenu } = useMenuStore();
  // const [hovered, setHovered] = useState(false);


  let formattedContent = "";

  if (productDetails && productDetails.content) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = productDetails.content;
    tempDiv.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (src && src.startsWith("/files/")) {
        img.setAttribute("src", `https://11.fesp.shop${src}`);
      }
    });

    formattedContent = tempDiv.innerHTML; // 변환된 HTML을 다시 문자열로 변환
  } else {
    formattedContent = "<p>상품 상세정보가 없습니다.</p>"; // 상품 상세정보가 없을 경우
  }

  return (
    <div className="flex justify-center px-[16px]">
      <div
        className="container mx-auto px-[24px] my-[40px]"
        style={{ maxWidth: "1200px" }}
      >
        <div>
          {cartItemsList.map((item) => (
            <div className="flex ml-[80px] mt-[50px]" key={item._id}>
              <div className="flex flex-col mr-[30px]">
                {item?.mainImages?.map((image, index) => (
                  <img
                    key={index}
                    src={getImage(image.path)}
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

              <dl className="w-full">
                <p className="text-[18px] font-semibold mb-[20px] mt-[30px]">
                  {item.name}
                </p>
                <p className="text-[13px] text-grey-80">상품설명</p>
                <hr className="mt-[12px] mb-[16px]" />

                <dl className="flex">
                  <dt className="mr-[90px] mb-[16px]">판매가</dt>
                  <dd>{item?.price?.toLocaleString()}</dd>
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
                    <div className="flex mb-[16px] mt-[70px]">
                      <button
                        className="bg-white border-2 border-gray-300 w-[160px] py-[15px] mr-[10px] rounded-md text-[15px] text-center hover:bg-secondary-20 flex justify-center items-center"
                        onClick={handleAddToWishlist.mutate}
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

          <div>
            <div className="flex mt-[80px]">
              {["상세정보", "구매안내", "상품후기", "QnA"].map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-[430px] pt-[20px] pb-[20px] cursor-pointer px-4 py-2 text-center text-[15px]
                    ${activeTab === tab
                      ? "border-t-3 border-l-3 border-r-3 bg-secondary-10 text-secondary-30 font-bold"
                      : "border-2 border-gray-300 text-gray-500"
                    }`}
                >
                  {tab}
                </div>
              ))}
            </div>

            <div className="p-4 ml-[auto] mr-[auto] w-[1026px] mt-[100px] mb-[100px]">
              {/* // 상세정보 탭일 경우 상품 상세정보를 출력 - 조건부 랜더링 작업 (리뷰필요) */}
              {activeTab === "상세정보" ? (
                <div
                  className="product-detail"
                  dangerouslySetInnerHTML={{ __html: formattedContent }} // HTML을 렌더링하기 위해 dangerouslySetInnerHTML 사용하며 __html 키로 전달
                />
              ) : (
                <p>{tabContent[activeTab]}</p> // 상세정보 탭이 아닐 경우 탭 컨텐츠 출력
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
