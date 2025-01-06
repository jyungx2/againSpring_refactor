import Layout from "@components/layouts";
import Slider from "@pages/Slider";
import Login from "@pages/user/Login";
import Myreview from "@pages/user/Myreview";
import Myquery from "@pages/user/Myquery";
import Shop from "@pages/Shop";
import Detail from "@pages/Detail";
import Myorder from "@pages/user/Myorder";

const homeRoutes = [
  {
    index: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Slider /> },
      { path: "login", element: <Login /> },
      { path: "order", element: <Myorder /> },
      { path: "review", element: <Myreview /> },
      { path: "query", element: <Myquery /> },
      { path: "shop", element: <Shop /> },
      { path: "detail", element: <Detail /> },
    ],
  },
];

export default homeRoutes;
