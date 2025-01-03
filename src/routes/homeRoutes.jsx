// import Login from '@pages/user/Login';

import EditPostPage from '@pages/QnA/EditPostPage';
import ListPage from '@pages/QnA/ListPage';
import NewPostPage from '@pages/QnA/NewPostPage';
import PostDetailPage from '@pages/QnA/PostDetailPage';

const homeRoutes = [
  // { index: true, element: <mainLayout /> },
  // { path: 'login', element: <Login /> },
  { path: 'qna', element: <ListPage /> },
  { path: 'qna/new', element: <NewPostPage /> },
  { path: 'qna/edit', element: <EditPostPage /> },
  { path: 'qna/detail', element: <PostDetailPage /> },
];

export default homeRoutes;
