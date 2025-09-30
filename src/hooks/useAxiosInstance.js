import axios from "axios";
import useUserStore from "@store/userStore";
import { useNavigate } from "react-router-dom";

const REFRESH_url = "/auth/refresh";

function useAxiosInstance() {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  const instance = axios.create({
    baseURL: "https://fesp-api.koyeb.app/market",
    timeout: 1000 * 20,
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "client-id": "febc11-final02-regj",
    },
  });

  instance.interceptors.request.use((config) => {
    if (user && config.url !== REFRESH_url) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }

    config.params = {
      ...config.params,
    };
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      console.error("인터셉터 결과(에러): ", error);
      const { config, response } = error;

      if (response?.status === 401) {
        if (config.url === REFRESH_url) {
          // 1. REFRESH_URL로 요청했는데도 오류가 났다면 로그인하도록
          navigateLogin();
        } else if (user) {
          // 2. 로그인 했으나 accessToken 만료된 경우,
          // -> refresh 토큰으로 accessToken 재발급 요청
          const refreshRes = await instance.get(REFRESH_url, {
            headers: { Authorization: `Bearer ${user.refreshToken}` },
          });
          // 새로 발급받은 accessToken 추출
          const accessToken = refreshRes.data.accessToken;

          // 로그인 유저 상태 설정
          setUser({ ...user, accessToken });
          config.headers.Authorization = `Bearer ${accessToken}`;

          // 인터셉터 무한루프를 방지하기 위해 instance 대신, axios 요청
          return axios(config);
        } else {
          navigateLogin();
        }
      }
      return Promise.reject(error);
    }
  );

  function navigateLogin() {
    const goToLogin = confirm(
      "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?"
    );
    goToLogin && navigate("/login", { state: { from: location.pathname } });
  }

  return instance;
}

export default useAxiosInstance;
