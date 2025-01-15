import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleKakaoLogin, API_KEY, REDIRECT_URI } from "@utils/kakaoUtils";
import useUserStore from "@store/userStore";

function Auth() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const getKakaoToken = async () => {
    try {
      const authCode = new URL(window.location.href).searchParams.get("code");
      console.log(authCode);

      // 카카오톡 로그인 API 요청
      const res = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        {
          grant_type: "authorization_code",
          client_id: API_KEY,
          redirect_uri: REDIRECT_URI,
          code: authCode,
        },
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );
      console.log("카카오톡 액세스토큰 응답 res: ", res);
      return res.data;
    } catch (err) {
      // 인증 코드(auth code)가 만료되었을 때(error code === 400) 새로운 요청이 필요
      // (∵ 인증 코드는 일회성으로만 사용 가능하며, 다시 발급받아야 정상적으로 액세스 토큰을 요청 가능)
      // cf) 액세스 토큰은 로그인 API 요청에 사용되며, 유효 시간은 더 길다.
      console.error(err);
      console.log("인증코드가 만료되었습니다. 새로운 인증 코드를 발급합니다.");

      if (err.response?.status === 400) {
        // 새로운 "유효" 인증 코드를 요청
        handleKakaoLogin();

        // 새로운 인증코드로 다시 액세스토큰 요청
        const newAuthCode = new URL(window.location.href).searchParams.get(
          "code"
        );
        if (newAuthCode) {
          try {
            const res = await axios.post(
              "https://kauth.kakao.com/oauth/token",
              {
                grant_type: "authorization_code",
                client_id: API_KEY,
                redirect_uri: REDIRECT_URI,
                code: newAuthCode,
              },
              {
                headers: {
                  "Content-type":
                    "application/x-www-form-urlencoded;charset=utf-8",
                },
              }
            );
            console.log("새로운 인증코드로 받아온 액세스토큰 응답: ", res);
            return res.data;
          } catch (nestedErr) {
            console.error(
              "새로운 인증코드로 액세스토큰 요청 실패: ",
              nestedErr
            );
          }
        }
      }
    }
  };

  const getUserKakaoInfo = async (token) => {
    try {
      const user = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
      console.log("토큰 유효, true");
      return user.data;
    } catch (err) {
      // 액세스토큰이 유효하지 않아 사용자 정보 가져올 때 에러 발생
      console.error(err);
      console.log("토큰 만료, false");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getKakaoToken();

        // kakaoToken = kakao측으로부터 받은 유저의 액세스토큰
        if (data) {
          localStorage.setItem("kakaoToken", JSON.stringify(data.access_token));
          const kakaoToken = localStorage.getItem("kakaoToken");

          if (kakaoToken) {
            const kakaoUser = await getUserKakaoInfo(kakaoToken);
            console.log("kakao user: ", kakaoUser);

            setUser({
              _id: kakaoUser.id,
              name: kakaoUser.properties.nickname,
              profile: kakaoUser.properties.profile_image,
              accessToken: kakaoToken,
            });
          }
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
