import styles from "./User.module.css";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useUserStore from "@store/userStore";
import { useNavigate } from "react-router-dom";

function Login() {
  const axios = useAxiosInstance();
  const setUser = useUserStore((store) => store.setUser);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    defaultValues: { email: "u1@market.com", password: "11111111" },
  });

  const login = useMutation({
    mutationFn: (loginData) => axios.post(`/users/login`, loginData),
    onSuccess: (res) => {
      console.log(res);

      const user = res.data.item;
      console.log(user);

      setUser({
        _id: user._id,
        name: user.name,
        accessToken: user.token.accessToken,
        refreshToken: user.token.refreshToken,
      });

      alert(user.name + "님 로그인 되었습니다.");

      navigate("/");
    },
  });

  return (
    <>
      <div className="py-32 mx-auto max-w-[1200px]">
        <div className="w-[400px] mx-auto flex flex-col items-center p-[20px_40px_44px] border border-grey-20 rounded-[20px] gap-[44px]">
          <div className="w-20 aspect-[1/1] object-contain">
            <a href="/" className="cursor-pointer">
              <img src="/public/favicon.png" alt="logo" />
            </a>
          </div>

          <div className="w-[320px]">
            <form onSubmit={handleSubmit(login.mutate)}>
              <div className="flex flex-col gap-3">
                <div
                  className={`border-2 border-grey-10 rounded-2xl focus-within:border-secondary-20 px-4`}
                >
                  <input
                    id="email"
                    type="text"
                    placeholder="이메일"
                    className={`${styles.inputUnset} ${styles.inputCustom}`}
                    {...register("email", { required: "이메일은 필수입니다." })}
                  />
                </div>

                <div className="border-2 border-grey-10 rounded-2xl focus-within:border-secondary-20 px-4">
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
              </div>

              <div className="mt-8">
                <button className="font-gowunBold w-full h-[42px] rounded-[12px] text-center cursor-pointer box-border bg-primary-40 text-white mb-[10px] focus-within:bg-primary-30">
                  로그인
                </button>
                <button className="font-gowunBold w-full h-[42px] rounded-[12px] text-center cursor-pointer box-border bg-kakao text-black focus-within:bg-kakao-hover">
                  카카오톡으로 시작하기
                </button>
              </div>

              <input
                type="checkbox"
                id="stay-login"
                className={`${styles.inputUnset} ${styles.checkboxCustom} peer`}
              />
              <label
                htmlFor="stay-login"
                className="flex items-center gap-3 mt-14 before:content-[''] before:w-[20px] before:h-[20px] before:inline-block before:bg-[url('/icons/emptybox.svg')] peer-checked:before:bg-[url('/icons/checkbox.svg')]"
              >
                자동 로그인
              </label>

              <ul className="font-gowun mt-14 text-center">
                <li className={styles.li}>
                  <a href="/" className={`cursor-pointer text-primary-70`}>
                    회원가입 ｜
                  </a>{" "}
                </li>
                <li className={styles.li}>
                  <div className="inline-block">
                    <a href="/" className={`cursor-pointer underline`}>
                      아이디
                    </a>
                    ·
                    <a href="/" className={`cursor-pointer underline`}>
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
