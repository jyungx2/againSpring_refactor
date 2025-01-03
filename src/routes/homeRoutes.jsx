import Login from "@pages/user/Login";
import Orderhistory from "@pages/user/Orderhistory";

const homeRoutes = [
  // { index: true, element: <mainLayout /> },
  { path: "login", element: <Login /> },
  { path: "order", element: <Orderhistory /> },
];

export default homeRoutes;
