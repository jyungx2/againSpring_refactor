import { useEffect } from "react";
import { wishlistStore } from "../store/wishlistStore";

const Wishlist = () => {
  const { wishlistItems, fetchWishlistItems, deleteItem, loading, error } =
    wishlistStore();

  useEffect(() => {
    fetchWishlistItems();
  }, [fetchWishlistItems]);

  const handleDeleteItem = (itemId) => {
    deleteItem(itemId);
  };

  return (
    <div className="mt-[40px] max-w-full">
      <div className="flex items-center mb-[16px]">
        <h2 className="text-[24px] font-gowun text-grey-80">위시리스트</h2>
        <button className="bg-white text-black py-[8px] px-[12px] font-[12px] font-gowunBold border border-grey-40 text-[14px] hover:bg-grey-30 ml-[14px]">
          등록하기
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[240px]">
          <p className="text-[18px] font-gowun text-grey-40">로딩 중...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-[240px]">
          <p className="text-[18px] font-gowun text-red-500">{error}</p>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-[18px] font-gowun text-grey-40">
            위시리스트가 비어있습니다.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="flex space-x-[20px] flex-nowrap mb-[10px]">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="border border-grey-20 rounded-md flex-none w-[180px] h-[240px] bg-gray-200 relative cursor-pointer group"
              >
                <button
                  className="absolute top-[5px] right-[5px] text-red-600 hover:text-red-800 text-[14px] focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => handleDeleteItem(item._id)}
                >
                  X
                </button>
                <div className="w-full h-[180px] bg-gray-300 rounded-t-md flex items-center justify-center">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between text-[16px] font-gowun text-left h-[60px] p-[4px] ">
                  <span
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    title={item.name}
                  >
                    {item.name}
                  </span>
                  <span
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    title={`${item.price.toLocaleString()}원`}
                  >
                    {item.price.toLocaleString()}원
                  </span>
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
