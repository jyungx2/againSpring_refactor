import useMenuStore from "../../store/menuStore";
import { Link, useNavigate } from "react-router-dom";

const Menu = () => {
  const { activeMenu, setActiveMenu } = useMenuStore();
  const navigate = useNavigate();

  // 서브메뉴 카테고리 매핑 작업
  const categoryMapping = {
    "주방용품": "kitchen",
    "세탁용품": "laundry",
    "욕실용품": "bathroom",
    "문구용품": "stationery",
    "식품": "food",
    "생활잡화": "life",
    "반려용품": "pet",
  };

  const menuItems = [
    { name: '다시,봄', links: ['/'] },
    {
      name: 'SHOP', links: ['/shop'],
      subMenu: ['주방용품', '세탁용품', '욕실용품', '문구용품', '식품', '생활잡화', '반려용품'],
    },
    {
      name: '공지사항',
      subMenu: ['공지사항', 'QnA'],
      links: ['/notice', '/QnA'],
    },
    { name: '이벤트', links: ['/event'] },
    { name: '탄소발자국', links: ['/tansointro'] },
  ];

  // 서브메뉴 클릭 시 이벤트 핸들러
  const handleShopSubmenuClick = (subItem) => {
    const category = categoryMapping[subItem] || "all-of-list"; // 카테고리 매핑
    navigate(`/shop?category=${category}`); // 카테고리 파라미터를 가진 URL로 이동
  };

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
                  {item.subMenu.map((subItem, subIndex) => ( // 서브메뉴 렌더링
                    <li key={subIndex}>
                      {item.name === "SHOP" ? ( // SHOP 메뉴의 경우 이벤트 핸들러 추가
                        <a
                          href="#"
                          onClick={(e) => {    // SHOP 메뉴의 서브메뉴 클릭 시 이벤트 핸들러 추가
                            e.preventDefault();
                            handleShopSubmenuClick(subItem); // 서브메뉴 클릭 시 이벤트 핸들러
                            setActiveMenu(null); // 클릭 시 서브메뉴 숨기기 
                          }}
                          className="block text-gray-700 hover:text-secondary font-medium whitespace-nowrap px-4 py-4 transition-all duration-200 ease-in-out hover:bg-gray-100"
                        >
                          {subItem}
                        </a>
                      ) : (
                        <Link
                          to={item.links[subIndex]}
                          className="block text-gray-700 hover:text-secondary font-medium whitespace-nowrap px-4 py-4 transition-all duration-200 ease-in-out hover:bg-gray-100"
                        >
                          {subItem}
                        </Link>
                      )}
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
