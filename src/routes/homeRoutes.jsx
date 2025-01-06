import Layout from '@components/layouts';
import Slider from '@pages/Slider';
import Login from '@pages/user/Login';
import Myreview from '@pages/user/Myreview';

const homeRoutes = [
  {
    index: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Slider /> },
      { path: 'login', element: <Login /> },
      { path: 'notice', element: <ListPage /> },
      { path: 'notice/new', element: <NewPostPage /> },
      { path: 'notice/edit', element: <EditPostPage /> },
      { path: 'notice/detail', element: <PostDetailPage /> },
      { path: 'login', element: <Login /> },
      { path: 'review', element: <Myreview /> },
    ],
  },
];

export default homeRoutes;
