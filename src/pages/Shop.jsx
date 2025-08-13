import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useMenuStore from "../store/menuStore";
import useAxiosInstance from "@hooks/useAxiosInstance";
import useUserStore from "../store/userStore";
function Shop() {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [selectedCategory, setSelectedCategory] = useState("all-of-list"); // 기본 카테고리 값 설정
  const productsPerPage = 9; // 페이지당 보여줄 아이템 수
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 정보를 가져오기 위해 사용
  const { activeMenu, setActiveMenu } = useMenuStore();
  const [hovered, setHovered] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUserStore(); // 유저 정보 가져오기
  const axiosInstance = useAxiosInstance();
  const getImage = (path) => {
    const baseURL = "https://fesp-api.koyeb.app/market"; // 이미지의 기본 URL을 설정합니다.
    return `${baseURL}${path}`; // 전체 이미지 URL을 반환합니다.
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const menuItems = [
    { name: "전체", links: ["/all-of-list"], category: "all-of-list" },
    { name: "주방용품", links: ["/kitchen"], category: "kitchen" },
    { name: "세탁용품", links: ["/laundry"], category: "laundry" },
    { name: "욕실용품", links: ["/bathroom"], category: "bathroom" },
    { name: "문구용품", links: ["/stationery"], category: "stationery" },
    { name: "식품", links: ["/food"], category: "food" },
    { name: "생활잡화", links: ["/life"], category: "life" },
    { name: "반려동물", links: ["/pet"], category: "pet" },
  ];

  const [selectedSort, setSelectedSort] = useState(""); // 정렬,필터

  // 필터, 정렬 함수
  function getFilteredAndSortedProducts() {
    // 카데고리 필터링
    let result = products.filter(
      (product) =>
        selectedCategory === "all-of-list" ||
        product.extra?.category?.includes(selectedCategory)
    ); //

    // 필터, 정렬 로직 시작
    switch (selectedSort) {
      case "new":
        //신상품
        result = result.filter((p) => p.extra?.isNew);
        break;
      case "best":
        // 베스트
        result = result.filter((p) => p.extra?.isBest);
        break;
      case "name":
        //오름차순
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "priceAsc":
        //낮은 가격
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      // 높은 가격
      case "priceDesc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      default: // 기본 - 아무 동작 하지 않을 경우
        break;
    }

    // 페이지 네이션
    const startIndex = (currentPage - 1) * productsPerPage;
    return result.slice(startIndex, startIndex + productsPerPage);
  }

  // 필터, 정렬된 상품 목록
  const currentproducts = getFilteredAndSortedProducts();

  // URL 쿼리 파라미터를 통해 카테고리를 가져와서 설정
  useEffect(() => {
    const query = new URLSearchParams(location.search); // URLSearchParams를 사용하여 URL 쿼리 파라미터를 가져옴
    const categoryFromURL = query.get("category") || "all-of-list"; // 값이 없으면 "all-of-list"로 설정
    setSelectedCategory(categoryFromURL);
    setCurrentPage(1); // 카테고리 변경 시 페이지 번호 초기화
  }, [location.search]); // selectedCategory가 변경될 때마다 실행하려고 했으나 혹시모를 무한루프 방지하기위해 안씀

  // 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/products");
        if (response.data.item) {
          setProducts(response.data.item);
        }
      } catch (error) {
        console.error("error:", error);
        setError("상품을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="flex justify-center px-[16px]">
      <div
        className="container mx-auto px-[24px] my-[40px]"
        style={{ maxWidth: "1200px" }}
      >
        {/* 상단 카테고리 영역 */}
        <div className="text-center my-8">
          <h1 className="text-4xl font-bold">
            {menuItems.find((item) => item.category === selectedCategory)?.name}
          </h1>
        </div>
        <div className="flex items-center mb-[16px]">
          <nav className="w-full">
            <ul className="flex justify-center gap-4 py-4">
              {menuItems.map((product, index) => (
                <li
                  key={index}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(product.category); // 카테고리 선택 시 해당 카테고리로 필터링
                    setCurrentPage(1); // 카테고리를 변경할 때 currentPage를 1로 초기화
                  }}
                  onMouseEnter={() => {
                    setActiveMenu(product.name);
                    setHovered(true);
                  }}
                  onMouseLeave={() => setHovered(false)}
                >
                  <a
                    href="#"
                    className={`
                      inline-block px-4 py-2 
                      rounded-full 
                      text-gray-700 font-semibold
                      transition-colors
                      ${
                        selectedCategory === product.category
                          ? "bg-secondary-30 text-white"
                          : "text-gray-700 hover:bg-secondary-20 hover:text-white"
                      }`}
                  >
                    {product.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* 상단 구분선 */}
        <hr className="mt-4 mb-4 border-t border-grey-20" />

        {/* 상품 개수 + 정렬/필터 버튼을 한 flex 컨테이너로 */}
        <div className="flex items-center justify-between mb-[16px]">
          {/* 왼쪽: 총 상품 개수 */}
          <p className="flex items-center">
            총{" "}
            {
              products.filter(
                (product) =>
                  selectedCategory === "all-of-list" ||
                  product.extra?.category?.includes(selectedCategory)
              ).length
            }{" "}
            개의 상품이 있습니다
          </p>

          {/* 오른쪽: 정렬/필터 버튼 */}
          {/* 정렬/필터 항목들 */}
          <div className="flex items-center space-x-3 text-2xl text-gray-500">
            <button
              onClick={() => setSelectedSort("new")}
              className={`
      cursor-pointer hover:underline
      ${selectedSort === "new" ? "text-black font-semibold" : ""}
    `}
            >
              신상품
            </button>
            <span className="text-gray-300 select-none">|</span>

            <button
              onClick={() => setSelectedSort("best")}
              className={`
      cursor-pointer hover:underline
      ${selectedSort === "best" ? "text-black font-semibold" : ""}
    `}
            >
              베스트
            </button>
            <span className="text-gray-300 select-none">|</span>

            <button
              onClick={() => setSelectedSort("name")}
              className={`
      cursor-pointer hover:underline
      ${selectedSort === "name" ? "text-black font-semibold" : ""}
    `}
            >
              상품명
            </button>
            <span className="text-gray-300 select-none">|</span>

            <button
              onClick={() => setSelectedSort("priceAsc")}
              className={`
      cursor-pointer hover:underline
      ${selectedSort === "priceAsc" ? "text-black font-semibold" : ""}
    `}
            >
              낮은가격
            </button>
            <span className="text-gray-300 select-none">|</span>

            <button
              onClick={() => setSelectedSort("priceDesc")}
              className={`
      cursor-pointer hover:underline
      ${selectedSort === "priceDesc" ? "text-black font-semibold" : ""}
    `}
            >
              높은가격
            </button>
            <span className="text-gray-300 select-none"></span>
          </div>
        </div>

        {/* 하단 구분선 */}
        <hr className="mt-4 mb-4 border-t border-grey-20" />
        {user?.type === "admin" && (
          <button
            className="block bg-primary-40 text-white px-4 py-2 round ed-md mt-4 mb-4 hover:bg-primary-60 transition-colors duration-300 ml-auto rounded"
            onClick={() => navigate("/admin/addproduct")}
          >
            {" "}
            상품 등록하기
          </button>
        )}

        {currentproducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[256px]">
            <p className="text-[18px] font-gowun text-grey-40">
              상품목록이 비어있습니다.
            </p>
          </div>
        ) : (
          <div>
            {/* 상품 목록 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentproducts.slice(0, 9).map((product) => (
                <Link
                  key={product._id}
                  to={`/detail/${product._id}`}
                  className="group block"
                >
                  <div className="overflow-hidden rounded-lg shadow-md">
                    <img
                      src={getImage(product.mainImages[0]?.path)}
                      alt={product.name}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {product.name}
                    </h2>
                    {product.originalPrice && (
                      <p className="text-lg text-gray-500 line-through">
                        {product.originalPrice}원
                      </p>
                    )}
                    <p className="mt-2 text-xl font-bold text-gray-900">
                      {product.price.toLocaleString()}원
                    </p>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      {product.extra?.isNew && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          NEW
                        </span>
                      )}
                      {product.extra?.isBest && (
                        <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                          BEST
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="justify-center mb-[16px] flex gap-[16px] mt-10">
              {Array.from({
                length: Math.ceil(
                  products.filter(
                    (product) =>
                      selectedCategory === "all-of-list" ||
                      product.extra?.category?.includes(selectedCategory)
                  ).length / productsPerPage
                ),
              }).map((_, index) => (
                <button
                  key={index}
                  className={`mx-1 px-3 py-1 ${
                    currentPage === index + 1
                      ? "bg-secondary-20 text-white"
                      : "bg-grey-20 text-black"
                  } w-[40px] py-[8px] rounded-md text-[15px] text-center hover:bg-secondary-40`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;
