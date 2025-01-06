import { useState } from 'react';

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const menuItems = [
    { name: '다시,봄', link: '/spring' },
    { name: '커뮤니티', link: '/community' },
    { name: 'SHOP', link: '/shop' },
    { name: '문의사항', link: '/inquiry' },
    {
      name: '공지사항',
      hasDropdown: true,
      subMenu: ['공지사항', '이벤트', 'Q&A'],
      links: ['/notice', '/event', '/qna'],
    },
  ];

  return (
    <header className='w-full bg-white shadow-md px-6'>
      <div className='flex justify-center py-6'>
        <img src='/public/images/logo.png' alt='logo' className='w-12 h-12' />
      </div>

      <nav className='w-full'>
        <div className='flex justify-center space-x-8'>
          {menuItems.map((item, index) => (
            <div
              key={index}
              className='relative group'
              onMouseEnter={() => item.hasDropdown && setActiveMenu(item.name)}
              onMouseLeave={() => item.hasDropdown && setActiveMenu(null)}
            >
              <a
                href={item.hasDropdown ? '#' : item.link}
                className='text-gray-700 hover:text-secondary font-semibold px-4 py-2'
              >
                {item.name}
              </a>
              {item.hasDropdown && activeMenu === item.name && (
                <div className='absolute left-0 top-full mt-2 bg-white shadow-lg rounded-md p-6 min-w-[200px] z-50'>
                  <ul className='space-y-3'>
                    {item.subMenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <a
                          href={item.links[subIndex]}
                          className='text-gray-700 hover:text-secondary block py-1'
                        >
                          {subItem}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      <div className='absolute top-4 right-6 flex space-x-4'>
        <a href='/login' className='text-gray-700 hover:text-secondary'>
          로그인
        </a>
        <a href='/profile' className='text-gray-700 hover:text-secondary'>
          <i className='fas fa-user'></i>
        </a>
        <a href='/cart' className='text-gray-700 hover:text-secondary'>
          <i className='fas fa-shopping-cart'></i>
        </a>
        <a href='/search' className='text-gray-700 hover:text-secondary'>
          <i className='fas fa-search'></i>
        </a>
      </div>
    </header>
  );
};

export default Header;
