import Login from "@pages/user/Login";
import Myquery from "@pages/user/Myquery";

const homeRoutes = [
  // { index: true, element: <mainLayout /> },
  { path: "login", element: <Login /> },
  { path: "query", element: <Myquery /> },
];

export default homeRoutes;
