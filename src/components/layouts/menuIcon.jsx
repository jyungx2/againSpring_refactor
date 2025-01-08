import useUserStore from "@store/userStore";

const MenuIcons = () => {
  const { user, resetUser } = useUserStore();

  const handleLogout = (e) => {
    e.preventDefault();
    resetUser();
    alert(`${user.name} 님, 정상적으로 로그아웃 되었습니다.`);
  };

  return (
    <div className="absolute top-4 right-6 flex space-x-8 items-center">
      {user ? (
        <form className="flex gap-[20px]" onSubmit={handleLogout}>
          <p className="flex items-center"> {user.name} 님 :)</p>
          <button
            type="submit"
            className="bg-secondary-20 py-2 px-4 text-white ml-2 hover:bg-secondary-10 rounded font-gowunBold"
          >
            로그아웃
          </button>
        </form>
      ) : (
        <>
          <a
            href="/login"
            className="bg-primary-40 px-4 py-2 rounded text-white hover:text-primary-20 font-gowunBold"
          >
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
        </>
      )}
    </div>
  );
};

export default MenuIcons;
