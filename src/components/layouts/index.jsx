import Header from "@components/layouts/Header";
import Footer from "@components/layouts/Footer";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";

const MainLayout = ({ title, description }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{title || "다시,봄 메인 페이지"}</title>
        <meta name="description" content={description || "다시,봄 홈페이지"} />
      </Helmet>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// title, description 문자열 타입 설정
MainLayout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default MainLayout;
