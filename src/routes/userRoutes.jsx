import Login from '@pages/user/Login';
import Auth from '@pages/user/Auth';
import Signup from '@pages/user/Signup';
import TermsOfService from '@pages/user/TermsOfService';
import MyOrder from '@pages/user/Myorder';
import AddReview from '@pages/user/AddReview';
import MyQna from '@pages/user/MyQna';
import OrderDetail from '@pages/user/OrderDetail';
import ReviewList from '@pages/user/ReviewList';
import UncompletedPage from '@pages/user/UncompletedPage';
import ExtraInfoForm from '@pages/user/ExtraInfoFrom';

const userRoutes = [
  { path: 'login', element: <Login /> },
  { path: 'users/login/kakao', element: <Auth /> },
  { path: 'signup/extra', element: <ExtraInfoForm /> },
  { path: 'signup', element: <Signup /> },
  { path: 'tos', element: <TermsOfService /> },
  { path: 'user/order', element: <MyOrder /> },
  { path: 'user/order/:orderId/review/:productId', element: <AddReview /> },
  { path: 'user/:type', element: <MyQna /> },
  { path: 'user/order/detail/:orderId', element: <OrderDetail /> },
  { path: 'user/review', element: <ReviewList /> },
  { path: 'uncompleted', element: <UncompletedPage /> },
];

export default userRoutes;
