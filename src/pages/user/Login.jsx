import styles from "./User.module.css";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useUserStore from "@store/userStore";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorMsg from "@components/ErrorMsg";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

function Login() {
  const axios = useAxiosInstance();
  const setUser = useUserStore((store) => store.setUser);
  const navigate = useNavigate();
  const location = useLocation();
  const [autoLogin, setAutoLogin] = useState(false);

  const KAKAO_URL = import.meta.env.VITE_KAKAO_AUTH_URL;
  const API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  const handleKakaoLogin = () => {
    window.location.href = `${KAKAO_URL}?client_id=${API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&state=${autoLogin}`;
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "test2@gmail.com", password: "12341234" },
  });

  const login = useMutation({
    mutationFn: (loginData) => axios.post(`/users/login`, loginData),
    onSuccess: (res) => {
      const user = res.data.item;

      setUser({
        _id: user._id,
        name: user.name,
        type: user.type,
        profile: user.image?.path,
        phone: user.phone,
        address: user.address,
        accessToken: user.token.accessToken,
        refreshToken: user.token.refreshToken,
        autoLogin,
      });

      alert(user.name + "님 로그인 되었습니다.");
      navigate(location.state?.from || "/");
    },
    onError: (err) => {
      console.error(err);

      if (err.response?.data.errors) {
        err.response.data.errors.forEach((error) =>
          setError(error.path, { message: error.msg })
        );
      } else {
        alert(
          err.response.data.message ||
          "오류가 발생하였습니다. 잠시 후 다시 요청하세요."
        );
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>다시, 봄 - 로그인</title>
        <meta property="og:title" content="다시봄 로그인" />
        <meta
          property="og:description"
          content="다시봄에 로그인하고 다양한 혜택과 서비스를 이용하세요."
        />
      </Helmet>

      <div className="py-32 mx-auto max-w-[1200px]">
        <div className="w-[400px] mx-auto flex flex-col items-center p-[20px_40px_44px] border border-grey-20 rounded-[20px] gap-[44px]">
          <div className="w-20 aspect-[1/1] object-contain">
            <a href="/" className="cursor-pointer">
              <img src="/favicon.png" alt="logo" />
            </a>
          </div>

          <div className="w-[320px]">
            <form onSubmit={handleSubmit(login.mutate)}>
              <div className="flex flex-col gap-3">
                <div
                  className={`border-2 border-grey-10 rounded-2xl focus-within:border-secondary-20 px-4 ${errors.email ? `${styles.error}` : ""
                    }`}
                >
                  <input
                    id="email"
                    type="text"
                    placeholder="이메일"
                    className={`${styles.inputUnset} ${styles.inputCustom}`}
                    {...register("email", { required: "이메일은 필수입니다." })}
                  />
                </div>
                <ErrorMsg target={errors.email} />

                <div
                  className={`border-2 border-grey-10 rounded-2xl focus-within:border-secondary-20 px-4 ${errors.password ? `${styles.error}` : ""
                    }`}
                >
                  <input
                    id="password"
                    type="password"
                    placeholder="비밀번호"
                    className={`${styles.inputUnset} ${styles.inputCustom}`}
                    {...register("password", {
                      required: "비밀번호는 필수입니다.",
                    })}
                  />
                </div>
                <ErrorMsg target={errors.password} />
              </div>

              <div className="mt-8">
                <button className="font-gowunBold w-full h-[42px] rounded-[12px] text-center cursor-pointer box-border bg-primary-40 text-white mb-[10px] focus-within:bg-primary-30">
                  로그인
                </button>
                <button
                  type="button"
                  className="font-gowunBold w-full h-[42px] rounded-[12px] text-center cursor-pointer box-border bg-kakao text-black focus-within:bg-kakao-hover"
                  onClick={handleKakaoLogin}
                >
                  카카오톡으로 시작하기
                </button>
              </div>

              <input
                type="checkbox"
                id="stay-login"
                className={`${styles.inputUnset} ${styles.checkboxCustom} peer`}
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
              />
              <label
                htmlFor="stay-login"
                className="flex items-center gap-3 mt-14 before:content-[''] before:w-[20px] before:h-[20px] before:inline-block before:bg-[url('/icons/emptybox.svg')] peer-checked:before:bg-[url('/icons/checkbox.svg')]"
              >
                자동 로그인
              </label>

              <ul className="font-gowun mt-14 text-center">
                <li className={styles.li}>
                  <a href="/tos" className={`cursor-pointer text-primary-70`}>
                    회원가입 ｜
                  </a>{" "}
                </li>
                <li className={styles.li}>
                  <div className="inline-block">
                    <a href="#" className={`cursor-pointer underline`}>
                      아이디
                    </a>
                    ·
                    <a href="#" className={`cursor-pointer underline`}>
                      비밀번호
                    </a>{" "}
                    찾기
                  </div>
                </li>
              </ul>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
