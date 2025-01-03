import PropTypes from "prop-types"; // PropTypes를 임포트합니다.
import Slider from "@pages/Slider";

Layout.propTypes = {
  children: PropTypes.node,
};

const Layout = ({ children }) => {
  return (
    <main className="flex-grow">
      <Slider />
      {children}
    </main>
  );
};

export default Layout;
