import axios from "axios";
import useUserStore from "@store/userStore";

function useAxiosInstance() {
  const { user } = useUserStore.getState();

  const instance = axios.create({
    baseURL: "https://11.fesp.shop",
    timeout: 1000 * 15,
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "client-id": "final02",
      ...(user && { Authorization: `Bearer ${user.token}` }),
    },
  });

  return instance;
}

export default useAxiosInstance;
