import axios from "axios";
import useUserStore from "@store/userStore";
import { useNavigate } from "react-router-dom";

const REFRESH_url = "/auth/refresh";

function useAxiosInstance() {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  const instance = axios.create({
    baseURL: "https://11.fesp.shop",
    timeout: 1000 * 15,
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "client-id": "final02",
    },
  });

  instance.interceptors.request.use((config) => {
    console.log(config);

    if (user && config.url !== REFRESH_url) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }

    config.params = {
      delay: 1000,
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
      const { config, response } = error; // response 속성이 안 보는이는데, 어떻게 뽑아냄? => 잘못된 baseUrl로 발생하는 오류의 경우, reponse객체가 없거나 undefined로 나타나기 때문에 안 보였던 것..

      // 401 에러는 "Unauthorized" (인증되지 않음) 상태를 나타내는 HTTP 상태 코드
      // 토큰 만료나 인증 실패와 관련된 처리만을 정확히 구분하여 처리하기 위해 추가한 조건문
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
          console.log(refreshRes);
          console.log(refreshRes.data.accessToken);
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
      // 인증실패 오류(401)로 인한 에러 외에, 에러를 명시적으로 reject()하여 Promise 체이닝에서 발생한 오류를 적절히 처리하기 위해 사용
      // 👉 비동기 함수에서는 오류를 throw로 던지거나, Promise.reject()로 반환하여 해당 오류가 나중에 catch()나 async/await에서 처리될 수 있도록 하기 위함..
      return Promise.reject(error);
    }
  );

  // 글쓰기/댓글 등록/장바구니 버튼 클릭 시, 로그인 요청
  function navigateLogin() {
    const goToLogin = confirm(
      "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?"
    );
    goToLogin && navigate("/login", { state: { from: location.pathname } });
  }

  return instance;
}

export default useAxiosInstance;
ult useAxiosInstance;
