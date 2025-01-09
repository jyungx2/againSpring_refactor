import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useMenuStore from "../store/menuStore";
import useAxiosInstance from "../hooks/useAxiosInstance";

function Shop() {
  const [cartItemsList, setCartItemsList] = useState([]);
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();
  const { activeMenu, setActiveMenu } = useMenuStore();
  const [hovered, setHovered] = useState(false);

  const menuItems = [
    { name: "주방용품", links: ["/spring"] },
    { name: "세탁용품", links: ["/community"] },
    { name: "문구용품", links: ["/shop"] },
    { name: "식품", links: ["/inquiry"] },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products", {
          params: {
            showSoldOut: true,
            seller_id: 3,
          },
        });
        // console.log("API 테스트", response.data); 
        setCartItemsList(response.data.item || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [axiosInstance]);

  const getImage = (path) => {
    const baseURL = "https://11.fesp.shop";
    return `${baseURL}${path}`
  }

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
            총 {cartItemsList.length} 개의 상품이 있습니다
          </p>
        </div>
        <hr className="mb-0 border-t border-grey-20" />
        {cartItemsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[256px]">
            <img
              src="/images/Cart1.png"
              alt="Empty Cart"
              className="w-[52px] h-[52px] mb-[20px]"
            />
            <p className="text-[18px] font-gowun text-grey-40">
              상품목록이 비어있습니다.
            </p>
          </div>
        ) : (
          <div>
            <table className="w-full table-auto">
              <tbody className="flex flex-wrap">
                {cartItemsList.map((item) => (
                  <tr
                    key={item._id}
                    className="w-1/4 sm:w-1/2 lg:w-1/4 xl:w-1/4 p-2 cursor-pointer"
                    onClick={() =>
                      navigate(`/detail/${item._id}`, { state: item })
                    }
                  >
                    <td className="flex flex-col items-start py-[20px]">
                      <img
                        src={getImage(item.mainImages?.[0]?.path) || "https://via.placeholder.com/80"}
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
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;
