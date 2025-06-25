import AdminProductUpload from '@pages/admin/AdminProductUpload';
import ProductEdit from '@pages/admin/ProductEdit';

const adminRoutes = [
  { path: '/admin/addproduct', element: <AdminProductUpload /> },
  { path: '/admin/product-edit', element: <ProductEdit /> },
];

export default adminRoutes;
