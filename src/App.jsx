import { RouterProvider, createBrowserRouter } from "react-router-dom";
import homeRoutes from "@routes/homeRoutes";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";

const router = createBrowserRouter(homeRoutes);

function App() {
  // App 컴포넌트 또는 index.html에서 포트원 스크립트 추가
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}

export default App;
