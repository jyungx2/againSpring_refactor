import Layout from "@components/layouts";
import Slider from "@pages/Slider";
import Login from "@pages/user/Login";
import Myreview from "@pages/user/Myreview";
import Shop from "@pages/Shop";
import Detail from "@pages/Detail";

const homeRoutes = [
  {
    index: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Slider /> },
      { path: "login", element: <Login /> },
      { path: "review", element: <Myreview /> },
      { path: "shop", element: <Shop /> },
      { path: "detail", element: <Detail /> },
    ],
  },
];

export default homeRoutes;
