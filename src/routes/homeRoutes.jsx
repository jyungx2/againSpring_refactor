import Layout from "@components/layouts";
import Slider from "@pages/Slider";
import Login from "@pages/user/Login";
import Myreview from "@pages/user/Myreview";
import Myquery from "@pages/user/Myquery";

const homeRoutes = [
  {
    index: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Slider /> },
      { path: "login", element: <Login /> },
      { path: "review", element: <Myreview /> },
      { path: "query", element: <Myquery /> },
    ],
  },
];

export default homeRoutes;
