import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { useState } from "react";

const Slider = () => {
  const [activeSlide] = useState(2); // 3번째 슬라이드 활성화 (링크 설정)
  const slides = [
    { id: 1, src: "/images/banner-1.png", alt: "Event 1" },
    { id: 2, src: "/images/banner-2.png", alt: "Event 2" },
    { id: 3, src: "/images/subscription_event.png", alt: "Event 3" },
  ];

  return (
    <div className="w-full bg-white">
      <div className="w-[1200px] mx-auto px-6">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="rounded-lg overflow-hidden custom-swiper"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              {/* 동적 경로 생성 */}
              {slide.id === activeSlide ? (
                <Link to={`/event/detail/${slide.id}`}>
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="object-cover"
                    style={{
                      width: "1200px", // 고정 너비 설정
                      height: "auto", // 비율 유지
                    }}
                  />
                </Link>
              ) : (
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="object-cover"
                  style={{
                    width: "1200px", // 고정 너비 설정
                    height: "auto", // 비율 유지
                  }}
                />
              )}

            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div >
  );
};

export default Slider;
