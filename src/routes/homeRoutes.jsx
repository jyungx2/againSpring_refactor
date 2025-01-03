import Login from "@pages/user/Login";
import Signup from "@pages/user/Signup";

const homeRoutes = [
  // { index: true, element: <mainLayout /> },
  { path: "login", element: <Login /> },
  { path: "signup", element: <Signup /> },
];

export default homeRoutes;
