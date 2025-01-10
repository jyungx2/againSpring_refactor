import Layout from '@components/layouts';
import Slider from '@pages/Slider';
import Login from '@pages/user/Login';
import Signup from '@pages/user/Signup';
import TermsOfService from '@pages/user/TermsOfService';
import Myorder from '@pages/user/Myorder';
import Myreview from '@pages/user/Myreview';
import Myquery from '@pages/user/Myquery';
import Shop from '@pages/Shop';
import Detail from '@pages/Detail';
import MainProducts from '@pages/MainProducts';
import NoticeListPage from '@pages/notice/NoticeListPage';
import NoticeNewPostPage from '@pages/notice/NoticeNewPostPage';
import NoticeEditPostPage from '@pages/notice/NoticeEditPostPage';
import NoticePostDetailPage from '@pages/notice/NoticePostDetailPage';
import QnAListPage from '@pages/qna/QnAListPage';
import QnANewPostPage from '@pages/qna/QnANewPostPage';
import QnAEditPostPage from '@pages/qna/QnAEditPostPage';
import QnAPostDetailPage from '@pages/qna/QnAPostDetailPage';
import ProductQnAPostDetailPage from '@pages/qna/ProductQnAPostDetailPage';
import ProductQnAEditPostPage from '@pages/qna/ProductQnAEditPostPage';
import MainContentSection from '@pages/MainContentSection';
import InfoSection from '@pages/InfoSection';
import EventMainPage from '@pages/eventPage/EventMainPage';
import EventDetailPage from '@pages/eventPage/EventDetailPage';

const homeRoutes = [
  {
    index: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <>
            <Slider />
            <MainProducts />
            <MainContentSection />
            <InfoSection />
          </>
        ),
      },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'tos', element: <TermsOfService /> },
      { path: 'order', element: <Myorder /> },
      { path: 'review', element: <Myreview /> },
      { path: 'query', element: <Myquery /> },
      { path: 'shop', element: <Shop /> },
      { path: 'detail/:id', element: <Detail /> },
      { path: 'notice', element: <NoticeListPage /> },
      { path: 'notice/new', element: <NoticeNewPostPage /> },
      { path: 'notice/edit', element: <NoticeEditPostPage /> },
      { path: 'notice/detail', element: <NoticePostDetailPage /> },
      { path: 'qna', element: <QnAListPage /> },
      { path: 'qna/new', element: <QnANewPostPage /> },
      { path: 'qna/edit', element: <QnAEditPostPage /> },
      { path: 'qna/detail/:id', element: <QnAPostDetailPage /> },
      { path: 'qna/product/detail/:id', element: <ProductQnAPostDetailPage /> },
      { path: 'qna/product/edit', element: <ProductQnAEditPostPage /> },
      { path: 'event', element: <EventMainPage /> },
      { path: 'event/detail/:id', element: <EventDetailPage /> },
    ],
  },
];

export default homeRoutes;
