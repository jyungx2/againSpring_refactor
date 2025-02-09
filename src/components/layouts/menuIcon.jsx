import useUserStore from "@store/userStore";
import { Link, useNavigate } from "react-router-dom";

const MenuIcons = () => {
  const { user, resetUser } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    resetUser();
    alert(`${user.name} 님, 정상적으로 로그아웃 되었습니다.`);
    navigate("/");
  };

  const handleCartClick = (e) => {
    if (user) {
      navigate(`/cart/${user._id}`);
    } else {
      e.preventDefault();
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };

  return (
    <div className="absolute top-4 right-6 flex space-x-6 items-center">
      {user ? (
        <form className="flex gap-[20px] items-center" onSubmit={handleLogout}>
          <Link
            to="/user/order"
            className="text-gray-700 hover:text-primary-30"
          >
            <i className="fas fa-user"></i>
          </Link>
          <Link
            to={`/cart/${user._id}`}
            className="text-gray-700 hover:text-primary-30 cursor-pointer"
            onClick={handleCartClick}
          >
            <i className="fas fa-shopping-cart"></i>
          </Link>
          <Link to="/search" className="text-gray-700 hover:text-primary-30">
            <i className="fas fa-search mr-2"></i>
          </Link>
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
          <Link to="/search" className="text-gray-700 hover:text-primary-30">
            <i className="fas fa-search mr-2"></i>
          </Link>
          <Link
            to="/login"
            className=" px-4 py-2 rounded text-black hover:bg-primary-20"
          >
            로그인
          </Link>

          {/* 회원가입 버튼을 삭제하고 
          마이페이지 클릭 시 비로그인 상태에서는 alert 창이 뜨고, 
          로그인 페이지로 이동 로직이 필요 */}
          <Link
            to="/"
            className=" px-4 py-2 rounded text-black hover:bg-secondary-10"
          >
            마이페이지
          </Link>
        </>
      )}
    </div>
  );
};

export default MenuIcons;
