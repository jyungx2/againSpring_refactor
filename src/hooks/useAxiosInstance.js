import axios from "axios";

function useAxiosInstance() {
  const instance = axios.create({
    baseURL: "https://11.fesp.shop",
    timeout: 1000 * 15,
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "client-id": "final02",
    },
  });

  return instance;
}

export default useAxiosInstance;
