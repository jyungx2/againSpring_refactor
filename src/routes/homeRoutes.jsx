import Layout from "@components/layouts";
import Slider from "@pages/Slider";
import Login from "@pages/user/Login";

const homeRoutes = [
  {
    index: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Slider /> },
      { path: "login", element: <Login /> },
    ],
  },
];

export default homeRoutes;
