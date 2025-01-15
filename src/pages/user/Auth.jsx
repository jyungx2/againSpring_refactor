import { useEffect } from "react";
import useAxiosInstance from "@hooks/useAxiosInstance";

function Auth() {
  const axios = useAxiosInstance();
  const REDIRECT_URI = "http://localhost:5173/users/login/kakao";
  const authCode = new URL(window.location.href).searchParams.get("code");

  const kakaoUserData = {
    code: authCode,
    redirect_uri: REDIRECT_URI,
    user: {},
  };
  console.log(kakaoUserData);

  useEffect(() => {
    const getKakaoUser = async (loginData) => {
      try {
        const res = await axios.post(`/users/login/kakao`, loginData);
        console.log("res: ", res);
      } catch (err) {
        console.error(err);
      }
    };
    getKakaoUser(kakaoUserData);
  }, [kakaoUserData]);

  return <>🔥Auth Page🔥</>;
}

export default Auth;
