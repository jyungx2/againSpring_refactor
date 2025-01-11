import axios from "axios";
import useUserStore from "@store/userStore";

const REFRESH_url = "/auth/refresh";

function useAxiosInstance() {
  const { user } = useUserStore();

  const instance = axios.create({
    baseURL: "https://11.fesp.sho",
    timeout: 1000 * 15,
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "client-id": "final02",
    },
  });

  instance.interceptors.request.use((config) => {
    if (user && config.url !== REFRESH_url) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }

    config.params = {
      delay: 1000,
      ...config.params,
    };
    return config;
  });

  return instance;
}

export default useAxiosInstance;
