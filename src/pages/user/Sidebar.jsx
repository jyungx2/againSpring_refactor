import { Link } from "react-router-dom";
import styles from "./User.module.css";
import useUserStore from "@store/userStore";

function Sidebar() {
  const currentPath = window.location.pathname;
  const { user } = useUserStore();

  const links = [
    { label: "주문조회", path: "/user/order" },
    { label: "1:1 문의", path: "/user/qna" },
    { label: "후기조회", path: "/user/review" },
    { label: "위시리스트", path: "/uncompleted" },
    { label: "쿠폰", path: "/uncompleted" },
    { label: "포인트", path: "/uncompleted" },
    { label: "정보수정", path: "/uncompleted" },
    { label: "회원탈퇴", path: "/uncompleted" },
  ];

  if (user?.type === 'admin') {
    links.push({ label: '상품등록', path: '/admin/addproduct'})
  }

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
