import { useEffect } from "react";
import useAxiosInstance from "@hooks/useAxiosInstance";
import useUserStore from "@store/userStore";
import { useNavigate } from "react-router-dom";

function Auth() {
  const navigate = useNavigate();
  const axios = useAxiosInstance();
  const { setUser } = useUserStore();

  const authCode = new URL(window.location.href).searchParams.get("code");
  const autoLogin = new URL(window.location.href).searchParams.get("state");

  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  const kakaoUserData = {
    code: authCode,
    redirect_uri: REDIRECT_URI,
    user: {},
  };

  const getKakaoUser = async (loginData) => {
    try {
      const res = await axios.post(`/users/login/kakao`, loginData);
      const kakaoUser = res.data.item;
      console.log("kakao user:", kakaoUser);

      if (kakaoUser) {
        setUser({
          _id: kakaoUser._id,
          name: kakaoUser.name,
          type: kakaoUser.type,
          profile: null,
          accessToken: kakaoUser.token.accessToken,
          refreshToken: kakaoUser.token.refreshToken,
          autoLogin,
          loginType: kakaoUser.loginType,
        });
      }
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authCode) {
      getKakaoUser(kakaoUserData);
    } else {
      console.error("Auth code is missing. Please check the URL parameters.");
    }
  }, []);

  return <>🔥Auth Page🔥</>;
}

export default Auth;
