import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useMenuStore from "../store/menuStore";
import useAxiosInstance from "@hooks/useAxiosInstance";

function Shop() {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [selectedCategory, setSelectedCategory] = useState("all-of-list"); // 기본 카테고리 값 설정
  const productsPerPage = 8; // 페이지당 보여줄 아이템 수
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 정보를 가져오기 위해 사용
  const { activeMenu, setActiveMenu } = useMenuStore();
  const [hovered, setHovered] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosInstance = useAxiosInstance();

  const startIndex = (currentPage - 1) * productsPerPage;

  const getImage = (path) => {
    const baseURL = "https://11.fesp.shop"; // 이미지의 기본 URL을 설정합니다.
    return `${baseURL}${path}`; // 전체 이미지 URL을 반환합니다.
  };

  // 카테고리 필터링: "all-of-list"일 경우 필터링 없이 모든 항목을 표시
  const currentproducts = products
    .filter(
      (product) =>
        selectedCategory === "all-of-list" ||
        product.extra?.category?.includes(selectedCategory) // 그렇지 않을 경우 선택된 카테고리에 해당하는 항목만 필터링
    )
    .slice(startIndex, startIndex + productsPerPage); // slice를 사용하여 페이지별로 아이템을 나누어 표시

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
        <div className="flex items-center mb-[16px]">
          <nav className="w-full">
            <ul className="flex justify-center gap-4 py-4">
              {menuItems.map((product, index) => (
                <li
                  key={index}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(product.category)} // 카테고리 선택 시 해당 카테고리로 필터링
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
                      ${selectedCategory === product.category ? "bg-secondary-30 text-white" : "text-gray-700 hover:bg-secondary-20 hover-text-white"}`}
                  >
                    {product.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center mb-[16px]">
          <p className="flex items-center justify-center mt-4">
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
        </div>
        <hr className="mb-0 border-t border-grey-20" />

        {currentproducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[256px]">
            <p className="text-[18px] font-gowun text-grey-40">
              상품목록이 비어있습니다.
            </p>
          </div>
        ) : (
          <div>
            <table className="w-full table-auto">
              <tbody className="flex flex-wrap">
                {currentproducts.map((product) => (
                  <tr
                    key={product._id}
                    className="w-1/4 sm:w-1/2 lg:w-1/4 xl:w-1/4 p-2 cursor-pointer"
                    onClick={() =>
                      navigate(`/ detail / ${product._id}`, { state: product })
                    }
                  >
                    <Link to={`/detail/${product._id}`}>
                      <td className="flex flex-col items-start py-[20px]">
                        <img
                          src={getImage(product.mainImages[0]?.path)}
                          alt={product.name}
                          style={{
                            width: "100%",
                            maxWidth: "300px",
                            height: "auto",
                            aspectRatio: "300 / 350",
                            minWidth: "100px",
                          }}
                        />
                        <div>
                          <h2 className="text-[16px] font-semibold text-grey-80 mt-[20px]">
                            {product.name}
                          </h2>
                        </div>

                        <p className="text-lg text-gray-500 line-through text-[16px] py-[10px]">
                          {product.originalPrice || ""}
                        </p>
                        <p className="text-xl font-bold text-[16px] py-[10px]">
                          {product.price}원
                        </p>
                      </td>
                    </Link>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  className={`mx-1 px-3 py-1 ${currentPage === index + 1
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
