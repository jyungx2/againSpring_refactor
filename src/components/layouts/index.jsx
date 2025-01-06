// 예: Product 관련 라우트 추가 시
// routes/productRoutes.js를 추가하고, index.js에서 통합하면 됩니다.

import { createBrowserRouter } from "react-router-dom";
import homeRoutes from "@routes/homeRoutes";
import cartRoutes from "@routes/cartRoutes";
import Home from "@pages/Home";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [...homeRoutes, ...cartRoutes],
  },
]);

export default routes;
