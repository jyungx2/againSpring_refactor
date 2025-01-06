import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

Layout.propTypes = {
  children: PropTypes.node,
};

Layout.defaultProps = {
  children: null,
};

const Layout = ({ children }) => {
  return (
    <main className='flex-grow'>
      {/* HelmetProvider 관리 */}
      <Helmet>
        <title>다시,봄 메인 페이지</title>
        <meta name='description' content='다시,봄 홈페이지' />
      </Helmet>

      {/* 메인 콘텐츠 */}
      <div className='container mx-auto px-4 py-8'>{children}</div>
    </main>
  );
};

export default Layout;
