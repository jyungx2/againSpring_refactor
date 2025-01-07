const MenuIcons = () => {
  return (
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
  );
};

export default MenuIcons;
