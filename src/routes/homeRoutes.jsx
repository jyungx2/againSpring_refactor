import Login from "@pages/user/Login";
import TermsOfService from "@pages/user/TermsOfService";

const homeRoutes = [
  // { index: true, element: <mainLayout /> },
  { path: "login", element: <Login /> },
  { path: "tos", element: <TermsOfService /> },
];

export default homeRoutes;
