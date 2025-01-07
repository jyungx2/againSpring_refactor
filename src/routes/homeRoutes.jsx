import Layout from '@components/layouts';
import Slider from '@pages/Slider';

import Login from '@pages/user/Login';
import Signup from '@pages/user/Signup';
import TermsOfService from '@pages/user/TermsOfService';
import Myreview from '@pages/user/Myreview';
import Myquery from '@pages/user/Myquery';

import Shop from '@pages/Shop';
import Detail from '@pages/Detail';

import EditPostPage from '@pages/notice/EditPostPage';
import ListPage from '@pages/notice/ListPage';
import NewPostPage from '@pages/notice/NewPostPage';
import PostDetailPage from '@pages/notice/PostDetailPage';

const homeRoutes = [
  {
    index: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Slider /> },
      { path: 'signup', element: <Signup /> },
      { path: 'login', element: <Login /> },
      { path: 'tos', element: <TermsOfService /> },
      { path: 'review', element: <Myreview /> },
      { path: 'query', element: <Myquery /> },

      { path: 'shop', element: <Shop /> },
      { path: 'detail', element: <Detail /> },

      { path: 'notice', element: <ListPage /> },
      { path: 'notice/new', element: <NewPostPage /> },
      { path: 'notice/edit', element: <EditPostPage /> },
      { path: 'notice/detail', element: <PostDetailPage /> },
    ],
  },
];

export default homeRoutes;
