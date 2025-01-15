import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initData } from "../../api/dbinit-sample/againSpring/data"; // initData 함수 import
import useMenuStore from "../store/menuStore";
import useAxiosInstance from "../hooks/useAxiosInstance";

function Shop() {
  const [cartItemsList, setCartItemsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [selectedCategory, setSelectedCategory] = useState("all-of-list"); // 기본 카테고리 값 설정
  const itemsPerPage = 8; // 페이지당 보여줄 아이템 수
  const navigate = useNavigate();
  const { activeMenu, setActiveMenu } = useMenuStore();
  const [hovered, setHovered] = useState(false);

  const startIndex = (currentPage - 1) * itemsPerPage;

  // 카테고리 필터링: "all-of-list"일 경우 필터링 없이 모든 항목을 표시
  const currentItems = cartItemsList
    .filter(
      (item) =>
        selectedCategory === "all-of-list" ||
        item.extra?.category?.includes(selectedCategory)
    )
    .slice(startIndex, startIndex + itemsPerPage);

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

  // 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await initData("client123", async (key) => key); // 예시로 clientId와 nextSeq 사용
        setCartItemsList(data.product || []);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // 카테고리 변경 시 페이지를 첫 페이지로 초기화
    setCurrentPage(1);
  }, [selectedCategory]);

  const getImage = (path) => {
    const baseURL = "https://11.fesp.shop"; // 이미지 파일이 저장된 베이스 URL
    return `${baseURL}${path}`; // full URL을 반환
  };

  return (
    <div className="flex justify-center px-[16px]">
      <div
        className="container mx-auto px-[24px] my-[40px]"
        style={{ maxWidth: "1200px" }}
      >
        <div className="flex items-center mb-[16px]">
          <nav className="w-full">
            <div className="flex justify-center space-x-8">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="relative group hover:bg-secondary-10 hover:text-white"
                  onClick={() => setSelectedCategory(item.category)} // 카테고리 선택 시 해당 카테고리로 필터링
                  onMouseEnter={() => {
                    setActiveMenu(item.name);
                    setHovered(true);
                  }}
                  onMouseLeave={() => setHovered(false)}
                >
                  <a
                    href="#"
                    className="text-gray-700 hover:text-secondary font-semibold"
                  >
                    {item.name}
                  </a>
                </div>
              ))}
            </div>
          </nav>
        </div>
        <div className="flex items-center mb-[16px]">
          <p className="flex items-center justify-center mt-4">
            총{" "}
            {
              cartItemsList.filter(
                (item) =>
                  selectedCategory === "all-of-list" ||
                  item.extra?.category?.includes(selectedCategory)
              ).length
            }{" "}
            개의 상품이 있습니다
          </p>
        </div>
        <hr className="mb-0 border-t border-grey-20" />
        {currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[256px]">
            <p className="text-[18px] font-gowun text-grey-40">
              상품목록이 비어있습니다.
            </p>
          </div>
        ) : (
          <div>
            <table className="w-full table-auto">
              <tbody className="flex flex-wrap">
                {currentItems.map((item) => (
                  <tr
                    key={item._id}
                    className="w-1/4 sm:w-1/2 lg:w-1/4 xl:w-1/4 p-2 cursor-pointer"
                    onClick={() =>
                      navigate(`/detail/${item._id}`, { state: item })
                    }
                  >
                    <td className="flex flex-col items-start py-[20px]">
                      <img
                        src={
                          getImage(item.mainImages?.[0]?.path) ||
                          "https://via.placeholder.com/80"
                        }
                        alt={item.name}
                        style={{
                          width: "100%",
                          maxWidth: "363px",
                          height: "auto",
                          aspectRatio: "363 / 484",
                          minWidth: "100px",
                        }}
                      />
                      <div>
                        <h2 className="text-[16px] font-semibold text-grey-80 mt-[20px]">
                          {item.name}
                        </h2>
                      </div>
                      <td className="text-center text-grey-80 font-gowunBold py-[20px] text-[16px]">
                        {item.price?.toLocaleString()}원
                      </td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="justify-center mb-[16px] flex gap-[16px] mt-10">
              {Array.from({
                length: Math.ceil(
                  cartItemsList.filter(
                    (item) =>
                      selectedCategory === "all-of-list" ||
                      item.extra?.category?.includes(selectedCategory)
                  ).length / itemsPerPage
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
