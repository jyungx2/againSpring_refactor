import { useState } from "react";
import useMenuStore from "../../store/menuStore";

const Header = () => {
  const { activeMenu, setActiveMenu } = useMenuStore();
  const [setHovered] = useState(false);
  const [timer, setTimer] = useState(null);

  const handleMouseEnter = (menuName) => {
    clearTimeout(timer); // 타이머 초기화
    setActiveMenu(menuName);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveMenu(null);
      setHovered(false);
    }, 300); // 300ms 딜레이
    setTimer(timeout);
  };

  const menuItems = [
    { name: "다시,봄", links: ["/Home"] },
    {
      name: "SHOP",
      subMenu: [
        "주방용품",
        "세탁용품",
        "욕실용품",
        "문구용품",
        "식품",
        "생활잡화",
        "반려동물",
      ],
      links: ["/shop", "/shop", "/shop", "/shop", "/shop", "/shop", "/shop"],
    },
    { name: "공지사항", links: ["/notice"] },
    { name: "이벤트", links: ["/event"] },
  ];

  return (
    <header className="w-full bg-white  border-b border-gray-200 z-50 relative">
      {/* 로고 */}
      <div className="flex justify-center py-4">
        <img src="public/images/Logo.png" alt="logo" className="w-24 h-24" />
      </div>

      {/* 메뉴 */}
      <nav className="w-full">
        <ul className="flex justify-center space-x-10 border-t border-gray-200 py-3 bg-white">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="relative group"
              style={{ minWidth: "120px" }} // 각 메뉴 항목의 최소 너비 설정
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              {/* 메인 메뉴 */}
              <a
                href={item.links ? item.links[0] : "#"}
                className="text-gray-700 hover:text-secondary font-medium text-center block"
              >
                {item.name}
              </a>

              {/* 서브메뉴 */}
              {item.subMenu && activeMenu === item.name && (
                <div
                  className="absolute top-full left-0 bg-white shadow-lg rounded-md py-4 px-6 z-50"
                  style={{ width: "100%" }} // 서브메뉴 너비를 메인 메뉴에 맞춤
                  onMouseEnter={() => clearTimeout(timer)} // 서브메뉴로 이동 시 유지
                  onMouseLeave={handleMouseLeave} // 서브메뉴 벗어날 때 숨김
                >
                  <ul className="space-y-2 text-center">
                    {item.subMenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <a
                          href={item.links[subIndex]}
                          className="text-gray-600 hover:text-secondary block whitespace-nowrap"
                        >
                          {subItem}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* 로그인,마이페이지,검색 아이콘 */}
      <div className="absolute top-4 right-6 flex space-x-4">
        <a href="/login" className="text-gray-700 hover:text-secondary">
          로그인
        </a>
        <a href="/profile" className="text-gray-700 hover:text-secondary">
          <i className="fas fa-user"></i>
        </a>
        <a href="/cart" className="text-gray-700 hover:text-secondary">
          <i className="fas fa-shopping-cart"></i>
        </a>
        <a href="/search" className="text-gray-700 hover:text-secondary">
          <i className="fas fa-search"></i>
        </a>
      </div>
    </header>
  );
};

export default Header;
