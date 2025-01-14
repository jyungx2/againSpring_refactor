const Wishlist = () => {
  // 여기에 위시리스트 항목을 직접 배열로 선언합니다.
  const wishlistItems = [
    { id: 1, name: "상품 1", image: "/path/to/image1.jpg" },
    { id: 2, name: "상품 2", image: "/path/to/image2.jpg" },
  ];

  return (
    <div className="mt-[40px]">
      <h2 className="text-[20px] font-gowunBold mb-[16px]">위시리스트</h2>
      {wishlistItems.length === 0 ? (
        <p className="text-[18px] font-gowun text-grey-40">
          위시리스트가 비어있습니다.
        </p>
      ) : (
        <ul>
          {wishlistItems.map((item) => (
            <li key={item.id} className="flex items-center py-[8px] ">
              <img
                src={item.image}
                alt={item.name}
                className="w-[50px] h-[50px] object-cover mr-[8px]"
              />
              <span className="text-[16px]">{item.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
