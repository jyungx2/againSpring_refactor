import Home from '../pages/Home';
import ListPage from '../pages/notice/ListPage';
import NewPostPage from '../pages/notice/NewPostPage';
import PostDetailPage from '../pages/notice/PostDetailPage';
import EditPostPage from '../pages/notice/EditPostPage';

const routes = [
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: 'notice',
        children: [
          {
            index: true,
            element: <ListPage />,
          },
          {
            path: 'new',
            element: <NewPostPage />,
          },
          {
            path: 'detail',
            element: <PostDetailPage />,
          },
          {
            path: 'edit',
            element: <EditPostPage />,
          },
        ],
      },
    ],
  },
];

export default routes;
