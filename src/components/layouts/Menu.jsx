import useMenuStore from "../../store/menuStore";
import { Link } from "react-router-dom";

const Menu = () => {
  const { activeMenu, setActiveMenu } = useMenuStore();

  const menuItems = [
    { name: '다시,봄', links: ['/'] },
    {
      name: 'SHOP',
      subMenu: [
        '주방용품',
        '세탁용품',
        '욕실용품',
        '문구용품',
        '식품',
        '생활잡화',
        '반려동물',
      ],
      links: ['/shop', '/shop', '/shop', '/shop', '/shop', '/shop', '/shop'],
    },
    {
      name: '공지사항',
      subMenu: ['공지사항', 'QnA'],
      links: ['/notice', '/QnA'],
    },
    { name: '이벤트', links: ['/event'] },
    { name: '탄소발자국', links: ['/tansomain'] },
  ];

  return (
    <nav className='w-[1200px] mx-auto bg-white'>
      <ul className='flex justify-center space-x-10 border-t border-gray-200 py-3'>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className='relative group'
            style={{ minWidth: '120px' }}
            onMouseEnter={() => setActiveMenu(item.name)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <Link
              to={item.links ? item.links[0] : "#"}
              className="text-gray-700 hover:text-secondary font-medium text-center block"
            >
              {item.name}
            </Link>
            {item.subMenu && activeMenu === item.name && (
              <div
                className='absolute top-full left-0 bg-white shadow-lg rounded-md py-4 px-6 z-50'
                style={{ width: '100%' }}
              >
                <ul className='space-y-2 text-center'>
                  {item.subMenu.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        to={item.links[subIndex]}
                        className="text-gray-600 hover:text-secondary block whitespace-nowrap"
                      >
                        {subItem}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
