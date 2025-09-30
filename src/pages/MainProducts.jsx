import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import useAxiosInstance from "@hooks/useAxiosInstance";

const MainProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosInstance = useAxiosInstance();

  // const getImage = (path) => {
  //   // const imageCloud = axiosInstance.post("/files", { attach: path });
  //   // console.log("imagecloud: ", imageCloud);
  //   // console.log("💗: ", `${path}`);

  //   return imageCloud;
  // };

  useEffect(() => {
    console.log("메인");
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/products");
        if (response.data.item) {
          setProducts(response.data.item);
        }
      } catch (error) {
        console.error("error:", error);
        setError("상품을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  // 새로운 상품과 베스트 상품, 할인 상품 필터링
  const newProducts = products.filter((product) => product.extra?.isNew);
  const bestProducts = products.filter((product) => product.extra?.isBest);
  // const discountedProducts = products.filter((product) => product.extra?.discount > 0);

  const renderSwiper = (title, description, items) => (
    <section className="my-14">
      <h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>
      <p className="text-2xl text-gray-500 mb-16 text-center">{description}</p>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={4}
        navigation
        className="product-slider custom-swiper"
      >
        {items.map((product) => {
          console.log("물건: ", product);
          return (
            <SwiperSlide key={product._id}>
              <Link
                to={`/detail/${product._id}`}
                className="flex flex-col items-center text-center "
              >
                <div
                  className="bg-gray-200 rounded-[12px] border border-gray-300 overflow-hidden"
                  style={{ width: "200px", height: "200px" }}
                >
                  <img
                    src={product.mainImages[0]?.path}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-4 text-2xl">{product.name}</p>
                <p className="text-lg text-gray-500 line-through">
                  {product.originalPrice?.toLocaleString() || ""}
                </p>
                <p className="text-xl font-bold">
                  {product.price.toLocaleString()}원
                </p>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );

  return (
    <div className="w-full px-6">
      <div className="max-w-[1200px] mx-auto">
        {renderSwiper(
          "새로운 상품",
          "다시,봄에서 매일매일 신상품이 업데이트 됩니다. 지금 바로 만나보세요",
          newProducts
        )}
        {renderSwiper(
          "베스트 상품",
          "다시, 봄에서 가장 인기있는 상품을 만나보세요.",
          bestProducts
        )}
        {/* {renderSwiper("할인 상품", discountedProducts)} */}
      </div>
    </div>
  );
};

export default MainProducts;
