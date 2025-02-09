import { useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Wishlist = () => {
  const axiosInstance = useAxiosInstance();

  const { data, loading, error } = useQuery({
    queryKey: ['bookmarks', 'products'],
    queryFn: () => axiosInstance.get('/bookmarks/product'),
    select: (res) => res.data,
  });

  const wishlistItems = data?.item.map(item => ({
    id: item.product._id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.mainImages[0]?.path
      ? `https://11.fesp.shop${item.product.mainImages[0].path}`
      : "/path/to/default/image.png",
    _id: item._id,
  }));

  const queryClient = useQueryClient();
  const deleteItem = useMutation({
    mutationFn: (itemId) => axiosInstance.delete(`/bookmarks/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', 'products'] });
    },
    onError: (err) => {
      console.error(err);
    }
  });

  const { addToCart, fetchCartItems } = useCartStore();
  const navigate = useNavigate();

  const handleCardClick = (item) => {
    navigate(`/detail/${item.id}`, { state: item });
  };

  const handleAddToCart = async (product) => {
    // console.log("카트에 상품 추가:", product)
    await addToCart(product, 1);
    await fetchCartItems();
  };

  return (
    <div className="mt-[40px] max-w-full">
      <div className="flex items-center mb-[16px]">
        <h2 className="text-[24px] font-gowun text-grey-80 mr-[8px]">
          위시리스트333
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
                      handleAddToCart(item);
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
