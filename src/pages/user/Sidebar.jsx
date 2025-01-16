import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./User.module.css";

function Sidebar() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  console.log(currentPath);

  const links = [
    { label: "주문조회", path: "/order" },
    { label: "1:1 문의", path: "/query" },
    { label: "위시리스트", path: "/uncompleted" },
    { label: "쿠폰", path: "/uncompleted" },
    { label: "포인트", path: "/uncompleted" },
    { label: "정보수정", path: "/uncompleted" },
    { label: "회원탈퇴", path: "/uncompleted" },
  ];

  const renderedLinks = links.map((link) => {
    return (
      <Link
        key={link.label}
        to={link.path}
        className={`mb-2 ${currentPath === link.path ? styles.active : ""}`}
      >
        {link.label}
      </Link>
    );
  });

  return (
    <>
      <div className="flex flex-col items-start gap-[24px] pt-[24px] min-w-[180px]">
        {renderedLinks}
      </div>
    </>
  );
}

export default Sidebar;
