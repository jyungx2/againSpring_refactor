import Menu from '@components/layouts/Menu';
import MenuIcons from '@components/layouts/menuIcon';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className='w-[1200px] mx-auto bg-white border-b border-gray-200 z-50 relative'>
      <div className='flex justify-center py-4'>
        <Link to='/'>
          <img src='/images/Logo.png' alt='logo' className='w-24 h-24' />
        </Link>
      </div>
      <Menu />
      <MenuIcons />
    </header>
  );
};

export default Header;
