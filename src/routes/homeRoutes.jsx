import Home from '../pages/Home';
import ListPage from '../pages/qna/ListPage';
import NewPostPage from '../pages/qna/NewPostPage';
import PostDetailPage from '../pages/qna/PostDetailPage';
import EditPostPage from '../pages/qna/EditPostPage';

const homeRoutes = [
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: 'qna',
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

export default homeRoutes;
