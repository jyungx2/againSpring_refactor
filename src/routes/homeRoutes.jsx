import Login from "@pages/user/Login";
import Myreview from "@pages/user/Myreview";

const homeRoutes = [
  // { index: true, element: <mainLayout /> },
  { path: "login", element: <Login /> },
  { path: "review", element: <Myreview /> },
];

export default homeRoutes;
