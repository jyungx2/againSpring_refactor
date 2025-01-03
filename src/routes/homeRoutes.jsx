import Signup from "@pages/user/Signup";
import Main from "@pages/mainLayout";

const homeRoutes = [
  { index: true, element: <Main /> },
  { path: "users/signup", element: <Signup /> },
];
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />,
//     children: [{ index: true, element: <Signup /> }],
//   },
// ]);

export default homeRoutes;
