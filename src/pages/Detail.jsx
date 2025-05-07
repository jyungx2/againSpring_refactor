import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useMenuStore from "../store/menuStore";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import ReviewList from "@pages/ReviewList";
import useUserStore from "@store/userStore";
import { toast } from "react-toastify";
import QnAList from "@pages/QnaList";

function Detail() {
  const [activeTab, setActiveTab] = useState("상세정보");
  const { id } = useParams();
  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate();
  const { user } = useUserStore();

  const handleAddToCart = useMutation({
    mutationFn: (product) => {
      console.log(product);
      // 필요한 데이터만 추출하여 전송
      const cartData = {
        product_id: parseInt(product._id, 10),
        quantity: parseInt(product.quantity, 10),
        // 필요한 다른 데이터들...
      };

      return axiosInstance.post("/carts", cartData);
    },
    onSuccess: (res) => {
      console.log("장바구니 추가 요청 후 반응: ", res);
      toast.success("장바구니에 추가되었습니다!");
      navigate(`/cart/${user.id}`);
    },
    onError: (err) => {
      console.error("장바구니 추가 요청 시 에러 발생: ", err);
      toast.error("오류가 발생하였습니다.");
    },
  });

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

  // ✅ 상품 상세 데이터 패칭
  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      axiosInstance.get(`/products/${id}`).then((res) => {
        const product = res.data.item;
        product.quantity = 1;
        return product;
      }),
  });

  if (productLoading || !productData)
    return <div>상품 정보를 불러오는 중...</div>;
  if (productError) return <div>상품 정보를 불러올 수 없습니다.</div>;

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
    productData.quantity = Math.max(1, newQuantity);
  };

  const totalPrice = productData.price * productData.quantity;

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
              <p className="text-[18px] font-semibold mb-[20px] mt-[30px]">
                {productData.name}
              </p>
              <p className="text-[13px] text-grey-80">상품설명</p>
              <hr className="mt-[12px] mb-[16px]" />

              <dl className="flex">
                <dt className="mr-[90px] mb-[16px]">판매가</dt>
                <dd>{productData?.price?.toLocaleString()}</dd>
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

              <div key={productData.id} className="border-b py-[20px]">
                <dd className="flex productDatas-start py-[10px]">
                  <div className="flex">
                    <h2 className="text-[15px] font-semibold text-grey-80 mr-[180px]">
                      {productData.name}
                    </h2>

                    <dd className="text-center py-[10px] mr-[60px]">
                      <div className="flex justify-center">
                        <div className="flex productDatas-center h-[32px] border border-grey-20">
                          <button
                            className="w-[24px] h-full border-r border-grey-20 hover:bg-grey-10"
                            onClick={() =>
                              updateQuantity(
                                productData.id,
                                productData.quantity - 1
                              )
                            }
                          >
                            -
                          </button>
                          <span className="w-[50px] text-center">
                            {productData.quantity}
                          </span>
                          <button
                            className="w-[24px] h-full border-l border-grey-20 hover:bg-grey-10"
                            onClick={() =>
                              updateQuantity(
                                productData.id,
                                productData.quantity + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </dd>

                    <dd className="text-center py-[10px]">
                      {(
                        productData.price * productData.quantity
                      ).toLocaleString()}
                      원
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
                    {productData?.quantity?.toLocaleString()}개
                  </dd>
                </div>
                <div className="flex mb-[16px] mt-[70px]">
                  <button
                    className="bg-white border-2 border-gray-300 w-[160px] py-[15px] mr-[10px] rounded-md text-[15px] text-center hover:bg-secondary-20 flex justify-center productDatas-center"
                    onClick={handleAddToWishlist.mutate}
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
                    onClick={() => alert("구매가 완료되었습니다!")}
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
