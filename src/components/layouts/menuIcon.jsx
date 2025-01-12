import useUserStore from "@store/userStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MenuIcons = () => {
  const { user, resetUser, setUser } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    resetUser();
    alert(`${user.name} 님, 정상적으로 로그아웃 되었습니다.`);
    navigate("/");
  };

  // 컴포넌트가 "처음" 마운트될 때 "상태를 확인"하고 UI를 갱신
  useEffect(() => {
    // 로컬스토리지에서 사용자 정보를 불러오는 작업 => 로컬저장소에 유저 정보가 남아 있다면, 그 유저정보를 가져와서 setUser를 이용해 다시 스토리지에 저장한다.
    // ✅ 이때, autoLogin: true라는 속성값도 같이 넘어오므로 다시 로컬스토리지에 저장 가능
    const localStoredUser = localStorage.getItem("user");
    if (localStoredUser) {
      setUser(JSON.parse(localStoredUser));
    }
  }, [setUser]); // setUser는 함수이고, 함수는 변하지 않기 때문에 사실상 setUser를 디펜던시 배열에 넣어도 useEffect는 한 번만 실행(= 빈 배열 넣은 것과 동일한 동작!)
  // => 함수는 디펜던시에 넣으나마나, 무조건 useEffect 내부의 함수는 한 번만 실행되므로, 여기서 setUser를 넣는 것은 선택사항이다. 하지만 리액트 최적화의 권장사항으로서 ESLink 경고가 뜨니까 일단 넣어놓은 것.

  return (
    <div className="absolute top-4 right-6 flex space-x-6 items-center">
      {user ? (
        <form className="flex gap-[20px] items-center" onSubmit={handleLogout}>
          <a href="/order" className="text-gray-700 hover:text-primary-30">
            <i className="fas fa-user"></i>
          </a>
          <a href="/cart" className="text-gray-700 hover:text-primary-30">
            <i className="fas fa-shopping-cart"></i>
          </a>
          <a href="/search" className="text-gray-700 hover:text-primary-30">
            <i className="fas fa-search mr-2"></i>
          </a>
          {user.profile && (
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={`https://11.fesp.shop${user.profile}`}
              alt="프로필 이미지"
            />
          )}
          <p> {user.name} 님 :)</p>
          <button
            type="submit"
            className="bg-primary-40 py-2 px-4 text-white hover:bg-primary-20 rounded font-gowunBold"
          >
            로그아웃
          </button>
        </form>
      ) : (
        <>
          <a href="/search" className="text-gray-700 hover:text-primary-30">
            <i className="fas fa-search mr-2"></i>
          </a>
          <a
            href="/login"
            className="bg-primary-40 px-4 py-2 rounded text-white hover:bg-primary-20 font-gowunBold"
          >
            로그인
          </a>
          <a
            href="/signup"
            className="bg-secondary-20 px-4 py-2 rounded text-white hover:bg-secondary-10 font-gowunBold"
          >
            회원가입
          </a>
        </>
      )}
    </div>
  );
};

export default MenuIcons;
