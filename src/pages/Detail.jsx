import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import ReviewList from "@pages/ReviewList";
import useUserStore from "@store/userStore";
import { toast } from "react-toastify";
import QnAList from "@pages/QnaList";
import useAxiosInstance from "@hooks/useAxiosInstance";

function Detail() {
  const [activeTab, setActiveTab] = useState("상세정보");
  const { id } = useParams();
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [quantity, setQuantity] = useState(1);

  const handlePurchase = useMutation({
    mutationFn: async (product) => {
      const products = [
        {
          _id: product._id,
          quantity: product.quantity,
        },
      ];
      await axios.post("/orders", { products });
    },
    onSuccess: async () => {
      toast.success(`${user.name} 님, 주문이 완료되었습니다.`);
    },
    onError: (err) => {
      console.error(err);
      alert("주문 처리 중 문제가 발생했습니다.");
    },
  });

  const handleAddToCart = useMutation({
    mutationFn: (product) => {
      console.log(product);
      // 필요한 데이터만 추출하여 전송
      const cartData = {
        product_id: parseInt(product._id, 10),
        quantity: parseInt(quantity, 10),
        // 필요한 다른 데이터들...
      };

      return axios.post("/carts", cartData);
    },
    onSuccess: (res) => {
      console.log("장바구니 추가 요청 후 반응: ", res);
      toast.success("장바구니에 추가되었습니다!");
      // navigate(`/cart/${user._id}`);
    },
    onError: (err) => {
      console.error("장바구니 추가 요청 시 에러 발생: ", err);
      toast.error("오류가 발생하였습니다.");
    },
  });

  const handleAddToWishlist = useMutation({
    mutationFn: () =>
      axios.post("/bookmarks/product", { target_id: parseInt(id) }),
    onSuccess: (res) => {
      if (res) {
        alert("위시리스트에 추가되었습니다!");
        navigate(`/wishlist`);
      } else {
        alert("위시리스트에 아이템 추가 실패");
      }
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        alert("이미 위시리스트에 추가된 상품입니다.");
      } else {
        alert("찜하기 중 오류가 발생했습니다.");
      }
    },
  });

  const getImage = (path) => {
    const baseURL = "https://11.fesp.shop";
    return `${baseURL}${path}`;
  };

  // ✅ 상품 상세 데이터 패칭
  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      axios.get(`/products/${id}`).then((res) => {
        const product = res.data.item;
        product.quantity = 1;
        console.log(product);
        return product;
      }),
  });

  if (productLoading || !productData)
    return <div>상품 정보를 불러오는 중...</div>;
  if (productError) return <div>상품 정보를 불러올 수 없습니다.</div>;

  // ✅ 직접적인 값 지정 방식
  // const tabContent = {
  //   상세정보: <DetailImage />,
  //   구매안내: <PurchaseInfo />,
  //   상품후기: <ReviewList productId={id} />,
  //   QnA: <QnAList productId={id} />,
  // };
  // ➡️ 이렇게 JSX 요소 자체를 값으로 저장한 경우, 이 객체가 생성될 때(즉, 컴포넌트가 렌더링될 때) 객체 안의 모든 JSX가 먼저 실행됩니다.
  // 즉, ReviewList, QnAList 등 모든 컴포넌트가 한 번씩은 렌더링 트리 생성에 참여해요. 비록 화면에는 tabContent[activeTab]만 보이더라도, 내부적으로는 나머지 컴포넌트도 컴포넌트 함수가 호출되어 Virtual DOM에 등록되는 과정이 생기는 거예요.

  // ✅ 함수형 방식
  // 반면에 이 방식은 tabContent[activeTab]()를 직접 호출할 때만 해당 컴포넌트가 실행되므로, 다른 탭 컴포넌트는 아예 건드리지 않음. 그래서 렌더링 최적화 측면에서 더 효율적
  // 다만, 내부 함수는 side effect 없이 렌더링만 담당하게 유지하는 것이 좋습니다.

  // props/state만으로 JSX를 반환하고, 상태 변경(데이터 조작, setState)이나 외부 네트워크 요청, 로컬스토리지 접근 등 외부와의 상호작용(💥이런 것들은 컴포넌트 내부 함수(tabContent 내부 함수 포함)**에서는 피하고, 보통 useEffect나 mutation, query 훅에서 처리💥) 없이 렌더링만 하는 순수 함수
  const tabContent = {
    상세정보: () => (
      <div style={{ textAlign: "center" }}>
        <img
          src="/images/pencildetail.jpg"
          alt="상세정보 이미지"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
    ),
    구매안내: () => (
      <div>
        <p className="pl-[100px] pr-[100px] text-[18px]">...내용 생략...</p>
      </div>
    ),
    상품후기: () => <ReviewList productId={id} />,
    QnA: () => <QnAList productId={id} />,
  };

  const updateQuantity = (newQuantity) => {
    setQuantity(Math.max(1, newQuantity));
  };

  const totalPrice = (productData.price * quantity).toLocaleString();

  return (
    <div className="flex justify-center px-[16px]">
      <div
        className="container mx-auto px-[24px] my-[40px]"
        style={{ maxWidth: "1200px" }}
      >
        <div>
          <div className="flex ml-[80px] mt-[50px]" key={productData._id}>
            <div className="flex flex-col mr-[30px]">
              {productData?.mainImages?.map((image, index) => (
                <img
                  key={index}
                  src={getImage(image.path)}
                  alt={`상품 이미지 ${index + 1}`}
                  className="w-[80px] h-[90px] mb-[10px] object-cover mr-[32px]"
                />
              ))}
            </div>
            <img
              src={getImage(productData?.mainImages?.[0]?.path)}
              alt="메인 상품 이미지"
              className="w-[370px] h-[492px] mb-[20px] object-cover mr-[70px]"
            />

            <hr className="mt-[12px] mb-[16px]" />

            <dl className="w-full">
              <p className="text-[2.4rem] font-semibold mb-[20px]">
                {productData.name}
              </p>
              <p className="text-[13px] text-grey-80">상품설명</p>
              <hr className="mt-[12px] mb-[16px]" />

              <dl className="flex">
                <dt className="mr-[90px] mb-[16px] font-bold">판매가</dt>
                <dd>{productData?.price?.toLocaleString()}</dd>
              </dl>

              <dl className="flex">
                <dt className="mr-[30px] mb-[16px] font-bold">국내·해외배송</dt>
                <dd>국내배송</dd>
              </dl>

              <dl className="flex">
                <dt className="mr-[90px] mb-[16px] font-bold">배송비</dt>
                <dd>3,000원 (50,000원 이상 구매 시 무료)</dd>
              </dl>

              <dl className="flex">
                <dt className="mr-[90px] mb-[16px] font-bold">원산지</dt>
                <dd>국내</dd>
              </dl>

              <hr className="mt-[12px] mb-[16px]" />

              <div key={productData.id} className="border-b">
                <dd className="flex productDatas-start py-[10px]">
                  <div className="flex items-center gap-4 w-full">
                    <h2 className="text-[15px] font-semibold text-grey-80 flex-1">
                      {productData.name}
                    </h2>

                    <dd className="text-center py-[10px] ml-auto pr-20">
                      <div className="flex productDatas-center h-[32px] border border-grey-20 items-center">
                        <button
                          className="w-[24px] h-full border-r border-grey-20 hover:bg-grey-10"
                          onClick={() => updateQuantity(quantity - 1)}
                        >
                          -
                        </button>
                        <span className="w-[50px]">{quantity}</span>
                        <button
                          className="w-[24px] h-full border-l border-grey-20 hover:bg-grey-10"
                          onClick={() => updateQuantity(quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </dd>
                  </div>
                </dd>
                <hr className="mt-[12px] mb-[1px]" />

                <div className="flex items-center text-[1.6rem]">
                  <dt className="py-[10px] mt-[1px] mr-[10px]">
                    총 상품 금액(수량):
                  </dt>
                  <dd className="text-grey-80 font-gowunBold py-[10px] text-[2.4rem]">
                    {totalPrice.toLocaleString()}원
                  </dd>
                  <dd className="text-grey-80 font-gowunBold text-[1.4rem] ml-3">
                    ({quantity}개)
                  </dd>
                </div>
                <div className="flex mb-[16px] mt-[3rem]">
                  <button
                    className="bg-white border-2 border-gray-300 w-[160px] py-[15px] mr-[10px] rounded-md text-[15px] text-center hover:bg-secondary-20 flex justify-center productDatas-center"
                    onClick={() => handleAddToWishlist.mutate()}
                  >
                    찜하기
                  </button>
                  <button
                    className="bg-white border-gray-300 border-2 w-[160px] py-[15px] mr-[10px] rounded-md text-[15px] text-center hover:bg-secondary-20 flex justify-center productDatas-center"
                    onClick={() => handleAddToCart.mutate(productData)}
                  >
                    장바구니
                  </button>
                  <button
                    className="bg-secondary-10 border-gray-300 border-2 w-[160px] py-[15px] mr-[10px] rounded-md text-[15px] text-center hover:bg-secondary-20 flex justify-center productDatas-center"
                    onClick={() => handlePurchase.mutate(productData)}
                  >
                    구매하기
                  </button>
                </div>
              </div>
            </dl>
          </div>

          <div>
            <div className="flex mt-[80px]">
              {["상세정보", "구매안내", "상품후기", "QnA"].map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
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

            <div className="p-4 ml-[auto] mr-[auto] w-[1026px] mt-[100px] mb-[100px]">
              <div>{tabContent[activeTab]()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
