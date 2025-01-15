import { useNavigate } from "react-router-dom";
import useUserStore from "@store/userStore";

function Auth() {
  const navigate = useNavigate();
  const authCode = new URL(window.location.href).searchParams.get("code");

  return <>🔥Auth Page🔥</>;
}

export default Auth;
