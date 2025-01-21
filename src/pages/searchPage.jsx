import { useState } from "react";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const instance = useAxiosInstance();
  const navigate = useNavigate();
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);

  const handleProductClick = (id) => {
    // console.log(`Navigating to /products/${id}`);
    // navigate(`/products/${id}`);
    navigate(`/detail/${id}`);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!searchTerm.trim()) {
      setErrorMessage("[필수] 상품명을 입력해주세요.");
      return;
    }

    setLoading(true);
    setSearchHistory((prev) => [...new Set([searchTerm, ...prev])]); // r검색 기록 중복 제거
    setErrorMessage(""); // 에러 메시지 초기화
    setIsSearchPerformed(true); // 검색 수행 상태 업데이트

    try {
      // console.log("URL:", `/api/products?query=${searchTerm}`);
      // 검색어를 기반으로 클라이언트에서 filter 함수로 필터링
      const response = await instance.get("/products");
      const allProducts = response.data.item;
      const filteredProducts = allProducts.filter((product) =>
        product.name.includes(searchTerm) // includes로 특정 요소 불러오기
      );
      // console.log("검색 결과:", response.data.item);
      setResults(filteredProducts);
      setErrorMessage("");
    } catch (error) {
      console.error("검색 실패:", error);
      setErrorMessage("검색 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[1200px] mx-auto px-6 py-8 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">상품 검색</h1>
      <form onSubmit={handleSearch} className="relative w-full max-w-4xl mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="찾으시는 상품명을 입력하세요"
            className="p-5 text-2xl border border-gray-300 rounded-lg w-full shadow focus:outline-none focus:ring-2 focus:ring-primary-40 pr-16"
          />
          <button
            type="submit"
            className={`absolute top-1/2 right-4 transform -translate-y-1/2 bg-primary-40 hover:bg-primary-20 px-4 py-3 rounded-md flex items-center justify-center shadow-lg transition-all duration-300 ${loading ? "cursor-not-allowed bg-gray-300" : ""
              }`}
            disabled={loading} // 로딩상태일경우 버튼 비활성화
          >
            ; // 검색 돋보기 아이콘 추가
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35"
              />
            </svg>
          </button>
        </div>
      </form>
      <div className="mb-4">
        {searchHistory.length > 0 && (
          <div>
            <p className="text-2xl text-gray-600 text-center">최근 검색어</p>
            <ul className="flex gap-2 text-center">
              {searchHistory.map((term, index) => (
                <li
                  key={index}
                  className="text-blue-500 cursor-pointer"
                  onClick={() => setSearchTerm(term)}
                >
                  {term}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      {results.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {results.map((product) => (
            <li
              key={product._id}
              className="border p-6 rounded shadow hover:shadow-md cursor-pointer"
              onClick={() => handleProductClick(product._id)}
            >
              <p className="text-xl text-center text-grey-40 mb-4">
                상품 클릭 시 해당 제품 페이지로 이동합니다.
              </p>
              <img
                src={`https://11.fesp.shop${product.mainImages?.[0]?.path}`}
                alt={product.name}
                className="w-full h-100 object-cover mb-4 rounded"
              />
              <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
              <p className="text-lg text-gray-700 font-bold">
                {product.price.toLocaleString()}원
              </p>
            </li>
          ))}
        </ul>
      ) : (
        isSearchPerformed && ( // 검색 수행 이후에만 결과 없음 메시지 표시
          <p className="text-gray-500 mt-4">검색 결과가 없습니다.</p>
        )
      )}
    </div>
  );
};

export default SearchPage;
