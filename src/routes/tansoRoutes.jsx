import TansoIntro from "@pages/tanso/tanso-intro";
import TansoCalc from "@pages/tanso/tanso-calc";
import TansoMain from "@pages/tanso/tanso-main";

const tansoRoutes = [
  { path: "tansointro", element: <TansoIntro /> },
  { path: "tansocalc", element: <TansoCalc /> },
  { path: "tansomain", element: <TansoMain /> },
];

export default tansoRoutes;
