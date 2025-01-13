import axios from "axios";
import useUserStore from '@store/userStore';

function useAxiosInstance() {
  const { user } = useUserStore(); // 코드 추가(ohDASEUL) : 사용자 정보 가져오기

  const instance = axios.create({
    baseURL: "https://11.fesp.shop",
    timeout: 1000 * 15,
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "client-id": "final02",
      "Authorization": user?.accessToken ? `Bearer ${user.accessToken}` : undefined, // 코드 추가(ohDASEUL) : API 요청 시 사용자 인증을 위한 토큰 헤더 추가
    },
  });

  return instance;
}

export default useAxiosInstance;
