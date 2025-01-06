import Header from "@components/layouts/Header";
import Footer from "@components/layouts/Footer";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Slider from "@components/Slider";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>다시, 봄 홈페이지</title>
      </Helmet>
      {/* Header */}
      <Header />

      {/* Slider */}
      <Slider />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
