import Login from "@pages/user/Login";
import Auth from "@pages/user/Auth";
import Signup from "@pages/user/Signup";
import TermsOfService from "@pages/user/TermsOfService";
import MyOrder from "@pages/user/Myorder";
import AddReview from "@pages/user/AddReview";
import MyQna from "@pages/user/MyQna";
import OrderDetail from "@pages/user/OrderDetail";
import ReviewList from "@pages/user/MyReviewList";
import UncompletedPage from "@pages/user/UncompletedPage";
import ProtectedRoute from "@components/layouts/ProtectedRoute";

const userRoutes = [
  { path: "login", element: <Login /> },
  { path: "users/login/kakao", element: <Auth /> },
  { path: "signup", element: <Signup /> },
  { path: "tos", element: <TermsOfService /> },

  // ✅ 로그인해야 접근 가능한 페이지만 ProtectedRoute 적용
  {
    element: <ProtectedRoute />,
    children: [
      { path: "user/order", element: <MyOrder /> },
      { path: "user/order/:orderId/review/:productId", element: <AddReview /> },
      { path: "user/:type", element: <MyQna /> },
      { path: "user/order/detail/:orderId", element: <OrderDetail /> },
      { path: "user/review", element: <ReviewList /> },
      { path: "uncompleted", element: <UncompletedPage /> },
    ],
  },
];

export default userRoutes;
