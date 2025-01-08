import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";

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
    {
      id: 6,
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
          <h2 className="text-3xl font-bold mb-6">추천제품</h2>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={4}
            navigation
            pagination={{ clickable: true }}
            className="product-slider"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <Link
                  to={`/detail/${product.id}`}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className="bg-gray-200"
                    style={{ width: "200px", height: "200px" }}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-4 text-2xl">{product.name}</p>
                  <p className="text-lg text-gray-500 line-through">
                    {product.originalPrice}
                  </p>
                  <p className="text-xl font-bold">{product.price}</p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <section className="my-8">
          <h2 className="text-3xl font-bold mb-6">신제품</h2>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={4}
            navigation
            pagination={{ clickable: true }}
            className="product-slider"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="flex flex-col items-center text-center">
                  <div
                    className="bg-gray-200"
                    style={{ width: "200px", height: "200px" }}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-4 text-2xl">{product.name}</p>
                  <p className="text-lg text-gray-500 line-through">
                    {product.originalPrice}
                  </p>
                  <p className="text-xl font-bold">{product.price}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <section className="my-8">
          <h2 className="text-3xl font-bold mb-6">할인 제품</h2>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={4}
            navigation
            pagination={{ clickable: true }}
            className="product-slider"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="flex flex-col items-center text-center">
                  <div
                    className="bg-gray-200"
                    style={{ width: "200px", height: "200px" }}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-4 text-2xl">{product.name}</p>
                  <p className="text-lg text-gray-500 line-through">
                    {product.originalPrice}
                  </p>
                  <p className="text-xl font-bold">{product.price}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>
    </div>
  );
};

export default MainProducts;
