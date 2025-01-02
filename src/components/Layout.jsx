import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='fixed top-0 left-0 right-0 z-50'>
        <Header />
      </div>
      <main className='flex-grow mt-[132px]'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
