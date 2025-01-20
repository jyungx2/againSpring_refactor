import Layout from "@components/layouts";
import Slider from "@pages/Slider";
import Login from "@pages/user/Login";
import Auth from "@pages/user/Auth";
import Signup from "@pages/user/Signup";
import TermsOfService from "@pages/user/TermsOfService";
import Myorder from "@pages/user/Myorder";
import AddReview from "@pages/user/AddReview";
import MyQna from "@pages/user/MyQna";
import Shop from "@pages/Shop";
import Detail from "@pages/Detail";
import MainProducts from "@pages/MainProducts";
import NoticeListPage from "@pages/notice/NoticeListPage";
import NoticeNewPostPage from "@pages/notice/NoticeNewPostPage";
import NoticeEditPostPage from "@pages/notice/NoticeEditPostPage";
import NoticePostDetailPage from "@pages/notice/NoticePostDetailPage";
import QnAListPage from "@pages/qna/QnAListPage";
import QnANewPostPage from "@pages/qna/QnANewPostPage";
import QnAEditPostPage from "@pages/qna/QnAEditPostPage";
import QnAPostDetailPage from "@pages/qna/QnAPostDetailPage";
// import MainContentSection from "@pages/MainContentSection";
import InfoSection from "@pages/InfoSection";
import Cart from "@pages/Cart";
import EventMainPage from "@pages/eventPage/EventMainPage";
import EventDetailPage from "@pages/eventPage/EventDetailPage";
import TansoPage from "@pages/tanso/tanso-main";
import SearchPage from "@pages/searchPage";
import UncompletedPage from "@pages/user/UncompletedPage";
import OrderDetail from "@pages/user/OrderDetail";
import ReviewList from "@pages/user/ReviewList";

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
            {/* <MainContentSection /> */}
            <InfoSection />
          </>
        ),
      },
      { path: "login", element: <Login /> },
      { path: "users/login/kakao", element: <Auth /> },
      { path: "signup", element: <Signup /> },
      { path: "tos", element: <TermsOfService /> },
      { path: "user/order", element: <Myorder /> },
      { path: "user/order/:orderId/review/:productId", element: <AddReview /> },
      { path: "user/:type", element: <MyQna /> },
      { path: "shop", element: <Shop /> },
      { path: "detail/:id", element: <Detail /> },
      { path: "notice", element: <NoticeListPage /> },
      { path: "notice/new", element: <NoticeNewPostPage /> },
      { path: "notice/edit/:id", element: <NoticeEditPostPage /> },
      { path: "notice/detail/:id", element: <NoticePostDetailPage /> },
      { path: "qna", element: <QnAListPage /> },
      { path: "qna/new", element: <QnANewPostPage /> },
      { path: "qna/edit/:id", element: <QnAEditPostPage /> },
      { path: "qna/detail/:id", element: <QnAPostDetailPage /> },
      { path: "event", element: <EventMainPage /> },
      { path: "event/detail/:id", element: <EventDetailPage /> },
      { path: "tanso", element: <TansoPage /> },
      { path: "cart/:userId", element: <Cart /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/uncompleted", element: <UncompletedPage /> },
      { path: "/user/order/detail/:orderId", element: <OrderDetail /> },
      { path: "/user/review", element: <ReviewList /> },
    ],
  },
];

export default homeRoutes;
