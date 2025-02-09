import { Navigate, Outlet } from "react-router-dom";
import useUserStore from "@store/userStore";
import { toast } from "react-toastify";

const ProtectedRoute = () => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    toast.error("로그인이 필요합니다.");
    // alert("로그인이 필요합니다.");
    return <Navigate to="/login" replace={true} />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
