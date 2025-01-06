const MainProduce = () => {
  const products = Array.from({ length: 7 }, (_, i) => ({
    id: i + 1,
    name: "상품명",
    price: "1,000원",
    originalPrice: "2,000원",
  }));

  return (
    <div className="w-full px-6">
      {/* 1200px 너비 */}
      <div className="max-w-[1200px] mx-auto">
        {/* 추천제품 섹션 */}
        <section className="my-8">
          <h2 className="text-lg font-bold mb-4">추천제품</h2>
          <div className="grid grid-cols-7 gap-4">
            {products.map((product) => (
              <div key={product.id} className="text-center">
                <div className="w-full h-[200px] bg-gray-200"></div>
                <p className="mt-2 text-sm">{product.name}</p>
                <p className="">{product.originalPrice}</p>
                <p className=""></p>
              </div>
            ))}
          </div>
        </section>



        {/* 1440px 너비 */}
        <div className="max-w-[1440px] mx-auto">

        </div>
      </div>
      );
};

      export default MainProduce;
