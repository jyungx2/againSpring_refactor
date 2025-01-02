import Header from './components/Header';
import Footer from './components/Footer';
import Slider from './pages/Slider';
import Layout from "./pages/mainLayout";



const App = () => {
  return (
    <div>
      <Header />
      {/* 레이아웃 들어갈 곳 */}
      <Layout />
      <Slider />
      <Footer />
    </div>
  );
};

export default App;