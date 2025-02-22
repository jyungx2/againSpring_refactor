import ProtectedRoute from "@components/layouts/ProtectedRoute";
import TansoIntro from "@pages/tanso/tanso-intro";
import TansoMain from "@pages/tanso/tanso-main";

const tansoRoutes = [
  {
    element: <ProtectedRoute />,
    children: [
      { path: "tansointro", element: <TansoIntro /> },
      { path: "tansomain", element: <TansoMain /> },
    ],
  },
];

export default tansoRoutes;
