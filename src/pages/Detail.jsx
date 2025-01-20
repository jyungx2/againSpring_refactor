import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosInstance from "@hooks/useAxiosInstance";
import useCartStore from "../store/cartStore"; // Store import
import useUserStore from "@store/userStore"; // 사용자 저장소 import

function Detail() {
  const [activeTab, setActiveTab] = useState("가");
  const { id } = useParams();
  const axiosInstance = useAxiosInstance();
  const [cartItemsList, setCartItemsList] = useState([]);
  const navigate = useNavigate();
  const { user } = useUserStore(); // 사용자 정보 가져오기
  const { addToCart } = useCartStore();

  const handleAddToCart = async (product) => {
    const success = await addToCart(product);
    if (success) {
      alert("장바구니에 추가되었습니다!");
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
        product.quantity = 1;
        setCartItemsList([product]);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, [id]);

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
              <button
                className="bg-white border-2 border-gray-300 w-[160px] py-[15px] mr-[10px] rounded-md text-[15px] text-center hover:bg-secondary-20 flex justify-center items-center"
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default Detail;
