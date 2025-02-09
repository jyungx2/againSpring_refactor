import Layout from "@components/layouts";
import Slider from "@pages/Slider";
import MainProducts from "@pages/MainProducts";
import InfoSection from "@pages/InfoSection";

import userRoutes from "./userRoutes";
import noticeRoutes from "./noticeRoutes";
import qnaRoutes from "./qnaRoutes";
import eventRoutes from "./eventRoutes";
import tansoRoutes from "./tansoRoutes";
import shopRoutes from "./shopRoutes";
import Wishlist from "@pages/WishList";
import ProtectedRoute from "@components/layouts/ProtectedRoute";

const homeRoutes = [
  {
    index: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <>
            <Slider />
            <MainProducts />
            <InfoSection />
          </>
        ),
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      ...userRoutes,
      ...noticeRoutes,
      ...qnaRoutes,
      ...eventRoutes,
      ...tansoRoutes,
      ...shopRoutes,
    ],
  },
];

export default homeRoutes;
