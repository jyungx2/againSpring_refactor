import EditPostPage from '@pages/notice/EditPostPage';
import ListPage from '@pages/notice/ListPage';
import NewPostPage from '@pages/notice/NewPostPage';
import PostDetailPage from '@pages/notice/PostDetailPage';
// import Login from '@pages/user/Login';

const homeRoutes = [
  // { index: true, element: <mainLayout /> },
  // { path: 'login', element: <Login /> },
  { path: 'notice', element: <ListPage /> },
  { path: 'notice/new', element: <NewPostPage /> },
  { path: 'notice/edit', element: <EditPostPage /> },
  { path: 'notice/detail', element: <PostDetailPage /> },
];

export default homeRoutes;