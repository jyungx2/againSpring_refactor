// import Login from '@pages/user/Login';

import EditPostPage from '@pages/qna/EditPostPage';
import ListPage from '@pages/qna/ListPage';
import NewPostPage from '@pages/qna/NewPostPage';
import PostDetailPage from '@pages/qna/PostDetailPage';

const homeRoutes = [
  // { index: true, element: <mainLayout /> },
  // { path: 'login', element: <Login /> },
  { path: 'qna', element: <ListPage /> },
  { path: 'qna/new', element: <NewPostPage /> },
  { path: 'qna/edit', element: <EditPostPage /> },
  { path: 'qna/detail', element: <PostDetailPage /> },
];

export default homeRoutes;