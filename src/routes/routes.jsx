import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import List from '../pages/QnA/List';
import NewPost from '../pages/QnA/NewPost';
import EditPost from '../pages/QnA/EditPost';
import PostDetail from '../pages/QnA/PostDetail';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <List /> },
        { path: 'new', element: <NewPost /> },
        { path: 'edit', element: <EditPost /> },
        { path: 'detail', element: <PostDetail /> },
      ],
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export default router;
