import { useState } from "react";
import useAxiosInstance from "@hooks/useAxiosInstance";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const instance = useAxiosInstance();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setErrorMessage("[필수] 상품명을 입력해주세요.");
      return;
    }

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
    }
  };

  return (
    <div className="w-[1200px] mx-auto px-6 py-8 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">상품 검색</h1>
      <form onSubmit={handleSearch} className="flex gap-4 mb-8 justify-center items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="찾으시는 상품명을 입력하세요"
          className="p-3 border rounded w-96"
        />
        <button
          type="submit"
          className="bg-primary-40 text-white px-6 py-3 rounded hover:bg-primary-20"
        >
          검색
        </button>
      </form>

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      {results.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {results.map((product) => (
            <li
              key={product._id}
              className="border p-6 rounded shadow hover:shadow-md cursor-pointer"
            >
              <img
                src={`https://11.fesp.shop${product.mainImages?.[0]?.path}`}
                alt={product.name}
                className="w-full h-100 object-cover mb-4 rounded"
              />
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-lg text-gray-700 font-bold">
                {product.price.toLocaleString()}원
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default SearchPage;
