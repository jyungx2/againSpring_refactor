import Shop from "@pages/Shop";
import Detail from "@pages/Detail";
import Cart from "@pages/Cart";
import SearchPage from "@pages/searchPage";

import ProtectedRoute from "@components/layouts/ProtectedRoute";

const shopRoutes = [
  { path: "shop", element: <Shop /> },
  { path: "detail/:id", element: <Detail /> },
  { path: "search", element: <SearchPage /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: "cart/:userId", element: <Cart /> }],
  },
];

export default shopRoutes;
