import NoticeListPage from "@pages/notice/NoticeListPage";
import NoticeNewPostPage from "@pages/notice/NoticeNewPostPage";
import NoticeEditPostPage from "@pages/notice/NoticeEditPostPage";
import NoticePostDetailPage from "@pages/notice/NoticePostDetailPage";

const noticeRoutes = [
  { path: "notice", element: <NoticeListPage /> },
  { path: "notice/new", element: <NoticeNewPostPage /> },
  { path: "notice/edit/:id", element: <NoticeEditPostPage /> },
  { path: "notice/detail/:id", element: <NoticePostDetailPage /> },
];

export default noticeRoutes;
