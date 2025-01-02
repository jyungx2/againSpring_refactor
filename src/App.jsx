import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import ListPage from './pages/qna/ListPage';
import NewPostPage from './pages/qna/NewPostPage';
import PostDetailPage from './pages/qna/PostDetailPage';
import EditPostPage from './pages/qna/EditPostPage';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path='/' element={<Navigate to='/qna' replace />} />

            <Route path='/qna'>
              <Route index element={<ListPage />} />
              <Route path='new' element={<NewPostPage />} />
              <Route path='detail' element={<PostDetailPage />} />
              <Route path='edit' element={<EditPostPage />} />
            </Route>

            <Route path='*' element={<Navigate to='/qna' replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
