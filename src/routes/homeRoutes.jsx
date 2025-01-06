import Layout from "@components/layouts";
import Slider from "@pages/Slider";
import Login from "@pages/user/Login";
import Cart from "@pages/Cart";

const homeRoutes = [
  {
    index: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Slider /> },
      { path: "login", element: <Login /> },
      { path: "cart", element: <Cart /> },
    ],
  },
];

export default homeRoutes;
