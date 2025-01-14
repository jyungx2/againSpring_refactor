import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const navigate = useNavigate();
  const API_KEY = "7b635f7b3d4379252462f78787fc908b";
  const REDIRECT_URI = "http://localhost:5173/users/login/kakao";

  const getKakaoToken = async () => {
    const authToken = new URL(window.location.href).searchParams.get("code");

    const res = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: API_KEY,
        redirect_uri: REDIRECT_URI,
        code: authToken,
      },
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    return res.data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getKakaoToken();

        // kakaoToken = kakao측으로부터 받은 유저의 액세스토큰
        if (data) {
          localStorage.setItem("kakaoToken", JSON.stringify(data.access_token));
          navigate("/");
        }
      } catch (err) {
        console.error("Error fetching kakao accessToken: ", err);
      }
    };
    fetchData();
  }, []);

  return <>🔥Auth Page🔥</>;
}

export default Auth;
