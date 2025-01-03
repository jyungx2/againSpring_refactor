import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const Slider = () => {
  return (
    <section className="slider-section my-8">
      <Swiper spaceBetween={50} slidesPerView={1} loop={true}>
        <SwiperSlide>
          <div className="bg-gray-300 h-64 flex items-center justify-center">
            슬라이드 1
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="bg-gray-300 h-64 flex items-center justify-center">
            슬라이드 2
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default Slider;