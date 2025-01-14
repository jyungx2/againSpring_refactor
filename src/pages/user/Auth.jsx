import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleKakaoLogin, API_KEY, REDIRECT_URI } from "@utils/kakaoUtils";

function Auth() {
  const navigate = useNavigate();

  const getKakaoToken = async () => {
    try {
      const authToken = new URL(window.location.href).searchParams.get("code");
      console.log(authToken);

      // 카카오톡 로그인 API 요청
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
    } catch (err) {
      // 인증 코드(auth code)가 만료되었을 때 새로운 요청이 필요
      // (∵ 인증 코드는 일회성으로만 사용 가능하며(10분동안 유효), 다시 발급받아야 정상적으로 액세스 토큰을 요청 가능)
      // cf) 액세스 토큰은 로그인 API 요청에 사용되며, 유효 시간은 더 길다.
      console.error(err);
      if (err.status === 400) {
        handleKakaoLogin(); // 새로운 인증 코드를 요청
      }
    }
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
