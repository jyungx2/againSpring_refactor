import useMenuStore from "../../store/menuStore";
import { Link } from "react-router-dom";

const Menu = () => {
  const { activeMenu, setActiveMenu } = useMenuStore();

  const menuItems = [
    { name: '다시,봄', links: ['/'] },
    { name: 'SHOP', links: ['/shop'], subMenu: ['test1', 'test2'], },
    {
      name: '공지사항',
      subMenu: ['공지사항', 'QnA'],
      links: ['/notice', '/QnA'],
    },
    { name: '이벤트', links: ['/event'] },
    { name: '탄소발자국', links: ['/tansointro'] },
  ];

  return (
    <nav className='w-[1200px] mx-auto bg-white'>
      <ul className="flex justify-center space-x-10 border-t border-gray-200 py-4">

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
              className="text-gray-700 hover:text-secondary font-medium text-center block py-2"
            >
              {item.name}
            </Link>
            {item.subMenu && (
              <div
                className={`absolute top-full left-0 bg-gray-50 shadow-md z-50
                transition-all duration-300 ease-in-out transform will-change-[transform,opacity] translate-y-[1px]
                ${activeMenu === item.name ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none delay-75"}`}
                style={{ width: "100%" }}
              >
                <ul className="w-full text-center bg-white">
                  {item.subMenu.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        to={item.links[subIndex]}
                        className="block text-gray-700 hover:text-secondary font-medium whitespace-nowrap px-4 py-2 transition-all duration-200 ease-in-out hover:bg-gray-100"
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
