import Shop from "@pages/Shop";
import Detail from "@pages/Detail";
import Cart from "@pages/Cart";
import SearchPage from "@pages/searchPage";

const shopRoutes = [
  { path: "shop", element: <Shop /> },
  { path: "detail/:id", element: <Detail /> },
  { path: "cart/:userId", element: <Cart /> },
  { path: "search", element: <SearchPage /> },
];

export default shopRoutes;
