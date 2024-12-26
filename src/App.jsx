import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home'; // default로 가져오기
import About from './pages/About'; // default로 가져오기
import Header from './components/Header';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Header />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;