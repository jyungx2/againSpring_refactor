import Header from "@components/layouts/Header";
import Footer from "@components/layouts/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";

const MainLayout = ({ title, description }) => {
  const location = useLocation();

  // 헤더와 푸터 숨기기
  const hideHeaderFooter = location.pathname === "/tansointro";

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{title || "다시,봄 메인 페이지"}</title>
        <meta name="description" content={description || "다시,봄 홈페이지"} />
      </Helmet>
      {!hideHeaderFooter && <Header />} {/*tansointro 헤더 숨기기 */}
      <main className={`flex-grow ${hideHeaderFooter ? "" : "container mx-auto px-4 py-8"}`}>
        <Outlet />
      </main>
      {!hideHeaderFooter && <Footer />} {/*푸터 숨기기 */}
    </div>
  );
};

// title, description 문자열 타입 설정
MainLayout.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

export default MainLayout;
