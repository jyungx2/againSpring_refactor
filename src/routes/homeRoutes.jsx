import Layout from '@components/layouts';
import Slider from '@pages/Slider';
import Login from '@pages/user/Login';
import Myreview from '@pages/user/Myreview';
import Shop from '@pages/Shop';
import Detail from '@pages/Detail';
import ListPage from '@pages/QnA/ListPage';
import NewPostPage from '@pages/QnA/NewPostPage';
import EditPostPage from '@pages/QnA/EditPostPage';
import PostDetailPage from '@pages/QnA/PostDetailPage';

const homeRoutes = [
  {
    index: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Slider /> },

      { path: 'login', element: <Login /> },
      { path: 'review', element: <Myreview /> },

      { path: 'shop', element: <Shop /> },
      { path: 'detail', element: <Detail /> },
      { path: 'query', element: <Myquery /> },

      { path: 'qna', element: <ListPage /> },
      { path: 'qna/new', element: <NewPostPage /> },
      { path: 'qna/edit', element: <EditPostPage /> },
      { path: 'qna/detail', element: <PostDetailPage /> },

      { path: 'shop', element: <Shop /> },
      { path: 'detail', element: <Detail /> },
    ],
  },
];

export default homeRoutes;
