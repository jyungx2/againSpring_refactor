import { RouterProvider, createBrowserRouter } from "react-router-dom";
import homeRoutes from "@routes/homeRoutes";
import { HelmetProvider } from "react-helmet-async";

const router = createBrowserRouter(homeRoutes);

function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}

export default App;
