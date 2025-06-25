import { useNavigate } from "react-router-dom";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useUserStore from "@store/userStore";

const Wishlist = () => {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useUserStore();

  const {
    data: wishList,
    loading,
    error,
  } = useQuery({
    queryKey: ["bookmarks", "products"],
    queryFn: () => axiosInstance.get("/bookmarks/product"),
    select: (res) => res.data.item,
  });

  const wishlistItems = wishList?.map((item) => ({
    _id: item._id, // wishlist에서의 고유한 id
    product_id: item.product._id, // 고유한 상품 id
    name: item.product.name,
    price: item.product.price,
    image: item.product.mainImages[0]?.path
      ? `https://11.fesp.shop${item.product.mainImages[0].path}`
      : "/path/to/default/image.png",
  }));

  const deleteItem = useMutation({
    mutationFn: (itemId) => axiosInstance.delete(`/bookmarks/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", "products"] });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handleCardClick = (item) => {
    // ✅ Detail.jsx에서 useLocation().state값을 활용하고 있지 않고 있음
    // useParams으로부터 가져오는 상품 id값만 있으면 정상적인 렌더링 가능 & "useParams + 서버 요청" 구조라면 { state: item }는 필수 아님.
    // ❗️ 하지만, 데이터가 이미 있을 때 넘기면 네트워크(fetch) 요청 한 번 줄일 수 있음
    // 💥 단점: location.state는 메모리 기반이라서 state로 넘기면 새로고침 시 데이터 날아간다. 따라서 정말 중요한 데이터는 query param이나 URL param으로 관리하는 게 안전하다.
    navigate(`/detail/${item.product_id}`);
  };

  const handleAddToCart = useMutation({
    mutationFn: (product) => {
      // 필요한 데이터만 추출하여 전송
      const cartData = {
        product_id: parseInt(product.product_id, 10),
        quantity: 1,
        // 필요한 다른 데이터들...
      };

      return axiosInstance.post("/carts", cartData);
    },
    onSuccess: (res) => {
      console.log("장바구니 추가 요청 후 반응: ", res);
      toast.success("장바구니에 추가되었습니다!");
      navigate(`/cart/${user._id}`);
      queryClient.invalidateQueries(["cart"]);
    },
    onError: (err) => {
      console.error("장바구니 추가 요청 시 에러 발생: ", err);
      toast.error("오류가 발생하였습니다.");
    },
  });

  return (
    <div className="mt-[40px] max-w-full">
      <div className="flex items-center mb-[16px]">
        <h2 className="text-[24px] font-gowun text-grey-80 mr-[8px]">
          위시리스트
        </h2>
        <span className="flex items-center justify-center w-[20px] h-[20px] bg-black bg-opacity-20 text-white rounded-full">
          {wishlistItems?.length}
        </span>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[240px]">
          <p className="text-[18px] font-gowun text-grey-40">로딩 중...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-[240px]">
          <p className="text-[18px] font-gowun text-red-500">{error}</p>
        </div>
      ) : wishlistItems?.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-[18px] font-gowun text-grey-40">
            위시리스트가 비어있습니다.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="flex space-x-[20px] flex-nowrap mb-[10px]">
            {wishlistItems?.map((item) => (
              <div
                key={item._id}
                className="border border-grey-20 rounded-md flex-none w-[180px] h-[240px] relative cursor-pointer group"
                onClick={() => handleCardClick(item)}
              >
                <button
                  className="absolute top-[5px] right-[5px] text-red-600 hover:text-red-800 text-[14px] focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem.mutate(item._id);
                  }}
                >
                  X
                </button>
                <div className="w-full h-[180px] bg-gray-300 rounded-t-md flex items-center justify-center">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
                    alt={item.name}
                  />
                </div>
                <div className="absolute left-0 right-0 p-[4px] bg-white transition-transform duration-200 group-hover:translate-y-[-80%]">
                  <span
                    className="block overflow-hidden text-ellipsis whitespace-nowrap"
                    title={item.name}
                  >
                    {item.name}
                  </span>
                  <span
                    className="block overflow-hidden text-ellipsis whitespace-nowrap"
                    title={`${item.price.toLocaleString()}원`}
                  >
                    {item.price.toLocaleString()}원
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    className="w-full h-full bg-primary-40 text-white text-[14px] font-gowun hover:bg-primary-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart.mutate(item);
                    }}
                  >
                    장바구니 추가
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;