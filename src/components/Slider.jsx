import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const Slider = () => {
  const slides = Array.from({ length: 3 }); // 임시로 슬라이드 3개 설정

  return (
    <section className="slider-section my-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="mySwiper"
      >
        {slides.map((_, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
              <span className="text-xl font-bold">다시,봄 이벤트 배너 {index + 1}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Slider;
