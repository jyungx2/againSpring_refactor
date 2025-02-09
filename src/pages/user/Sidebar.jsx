import { Link, useLocation } from "react-router-dom";
import styles from "./User.module.css";

function Sidebar() {
  // const currentPath = window.location.pathname;
  const location = useLocation();
  const currentPath = location.pathname;

  /*
    💡 React 생태계에서 useLocation 훅을 사용하는 것이 window.location을 직접 사용하는 것보다 적합한 이유를 설명해드리겠습니다:
    1. 리액티브(반응형) 업데이트
    window.location은 단순히 현재 URL 정보를 읽기만 합니다
    useLocation은 React의 상태 관리 시스템과 통합되어 있어서, URL이 변경될 때마다 컴포넌트가 자동으로 리렌더링됩니다


    2. 테스트 용이성
    window.location은 전역 객체이기 때문에 테스트하기 어렵습니다
    useLocation은 React Router의 테스트 유틸리티와 함께 사용할 수 있어 단위 테스트가 훨씬 쉽습니다


    3. 서버 사이드 렌더링(SSR) 호환성
    window 객체는 브라우저에서만 사용 가능하기 때문에 SSR 환경에서 문제가 발생할 수 있습니다
    useLocation은 SSR을 고려하여 설계되었기 때문에 안전하게 사용할 수 있습니다


    4. React의 선언적 패러다임 준수
    window.location은 명령형(imperative) 방식입니다
    useLocation은 React의 선언적(declarative) 방식에 맞게 설계되었습니다
  */

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
