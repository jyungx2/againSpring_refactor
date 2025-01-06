import Layout from "@components/layouts";
import Slider from "@pages/Slider";
import Login from "@pages/user/Login";
import Cart from "@pages/Cart";
import Myreview from "@pages/user/Myreview";

const homeRoutes = [
  {
    index: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Slider /> },
      { path: "login", element: <Login /> },
      { path: "cart", element: <Cart /> },
      { path: "review", element: <Myreview /> },
    ],
  },
];

export default homeRoutes;
