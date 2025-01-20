import QnAListPage from "@pages/qna/QnAListPage";
import QnANewPostPage from "@pages/qna/QnANewPostPage";
import QnAEditPostPage from "@pages/qna/QnAEditPostPage";
import QnAPostDetailPage from "@pages/qna/QnAPostDetailPage";

const qnaRoutes = [
  { path: "qna", element: <QnAListPage /> },
  { path: "qna/new", element: <QnANewPostPage /> },
  { path: "qna/edit/:id", element: <QnAEditPostPage /> },
  { path: "qna/detail/:id", element: <QnAPostDetailPage /> },
];

export default qnaRoutes;
