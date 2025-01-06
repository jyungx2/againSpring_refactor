const MainProducts = () => {
  const products = [
    {
      id: 1,
      name: "비누",
      price: "1,000,000원",
      originalPrice: "1,200,000원",
      imageUrl: "/images/product-1.png",
    },
    {
      id: 2,
      name: "비누",
      price: "1,500,000원",
      originalPrice: "1,800,000원",
      imageUrl: "/images/product-1.png",
    },
    {
      id: 3,
      name: "비누",
      price: "300,000원",
      originalPrice: "350,000원",
      imageUrl: "/images/product-1.png",
    },
    {
      id: 4,
      name: "비누",
      price: "250,000원",
      originalPrice: "300,000원",
      imageUrl: "/images/product-1.png",
    },
    {
      id: 5,
      name: "비누",
      price: "800,000원",
      originalPrice: "900,000원",
      imageUrl: "/images/product-1.png",
    },
  ];

  return (
    <div className="w-full px-6">
      <div className="max-w-[1200px] mx-auto">
        <section className="my-8">
          <h2 className="text-xl font-bold mb-6">추천제품</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center text-center"
                style={{ width: "200px" }}
              >
                <div
                  className="bg-gray-200"
                  style={{ width: "100%", height: "200px" }}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-4 text-sm">{product.name}</p>
                <p className="text-sm text-gray-500 line-through">
                  {product.originalPrice}
                </p>
                <p className="text-sm font-bold">{product.price}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="my-8">
          <h2 className="text-xl font-bold mb-6">추천제품</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center text-center"
                style={{ width: "200px" }}
              >
                <div
                  className="bg-gray-200"
                  style={{ width: "100%", height: "200px" }}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-4 text-sm">{product.name}</p>
                <p className="text-sm text-gray-500 line-through">
                  {product.originalPrice}
                </p>
                <p className="text-sm font-bold">{product.price}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainProducts;
