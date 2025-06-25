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
import PurchaseComplete from "@pages/PurchaseComplete";
import Checkout from "@pages/Checkout";
import NotFound from "@pages/NotFound";
import adminRoutes from "./adminRoutes";
import paymentRoutes from "./PaymentRoutes";

const homeRoutes = [
  {
    index: "/",
    element: <Layout />,
    errorElement: <NotFound />,
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
      {
        path: "purchase-complete",
        element: <PurchaseComplete />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      ...userRoutes,
      ...noticeRoutes,
      ...qnaRoutes,
      ...eventRoutes,
      ...tansoRoutes,
      ...shopRoutes,
      ...adminRoutes,
      ...paymentRoutes,
    ],
  },
];

export default homeRoutes;
