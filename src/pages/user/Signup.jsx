import { useForm } from "react-hook-form";
import styles from "./User.module.css";
import { useMutation } from "@tanstack/react-query";
import useAxiosInstance from "@hooks/useAxiosInstance";
import ErrorMsg from "@components/ErrorMsg";

function Signup() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onFocus",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const axios = useAxiosInstance();

  const registerUser = useMutation({
    mutationFn: (userInfo) => {
      console.log("Initial userInfo: ", userInfo); // name, email, password, password-confirm 정보가 담긴 객체

      userInfo.type = "user";
      console.log("Final userInfo: ", userInfo);
      return axios.post(`/users`, userInfo);
    },
    onSuccess: () => {
      alert("회원가입이 완료되었습니다.");
    },
    onError: (err) => {
      console.error(err);

      // 클라이언트 측에서 유효성 검사에 실패한 오류를 1차적으로 처리
      if (err.response.data.errors) {
        err.reponse.data.errors.forEach(
          (error) => setError(error.path, { message: error.msg })
          // errors 객체를 생성하는 함수 - 객체이기 때문에 키값과 밸류값, 두가지 매개변수를 필요로 함
          // error.path === register로 설정한 field 이름
          // error.msg === 최초 검증 시점(useForm의 mode 속성값)에 따라 클라이언트 측에서 유효성 검사를 통해 발생한 메시지일 수도 있고, 클라이언트 측에서는 서버로부터 받은 오류 메시지를 setError 함수에 전달하여 폼 필드에 오류를 표시하는 역할도 하기 때문에 서버에서 설정한 오류 메시지(서버에서 정의한 유효성 검사 규칙에 따라 자동으로 생성된 메시지)일 수도 있다.
        );
      }
      // 서버에서 발생한 오류 메시지를 처리
      else {
        alert(
          err.response.data.message ||
            "오류가 발생하였습니다. 잠시 후 다시 요청하세요."
        );
      }
    },
  });

  return (
    <>
      <div className="box-border max-w-[1200px] my-[60px] px-6 mx-auto">
        <div className="w-[460px] mx-auto flex flex-col items-center p-[18px_40px_28px] border-2 border-grey-10 rounded-[20px] gap-8">
          <div className="py-3">
            <h1 className="font-gowunBold text-[32px] text-grey-60">
              회원가입
            </h1>
          </div>

          <div className="w-[400px]">
            <form
              onSubmit={handleSubmit(registerUser.mutate)}
              className="flex flex-col gap-6"
            >
              <div
                id="fildupload_profile_img"
                className="relative mx-auto w-[100px] h-[100px]"
                accept="image/jepg, image/jpg, image/png, image/gif, image/svg+xml"
              >
                <div className="w-full h-full bg-[url('./icons/profile.svg')] bg-cover bg-center"></div>

                <div className="absolute bottom-[4px] right-0 rounded-full  border border-grey-30">
                  <button className="box-border w-10 h-10 bg-white rounded-full cursor-pointer">
                    <img
                      className="w-7 h-7 mx-auto mt-1"
                      src="/icons/camera.svg"
                    />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex gap-2 pl-2 border-2 border-grey-20 rounded-3xl mb-4 focus-within:border-secondary-20">
                  <img src="/icons/user.svg" />
                  <input
                    id="name"
                    type="text"
                    placeholder="이름"
                    className={`${styles.inputUnset}`}
                    {...register("name", { required: "이름은 필수입니다." })}
                  />
                </div>
                <ErrorMsg target={errors.name} />
              </div>

              <div className="id-collection">
                <div className="flex gap-2 pl-2 border-2 border-grey-20 rounded-3xl mb-4 focus-within:border-secondary-20">
                  <img src="/icons/user.svg" />
                  <input
                    id="email"
                    type="email"
                    placeholder="이메일"
                    className={`${styles.inputUnset}`}
                    {...register("email", { required: "이메일은 필수입니다." })}
                  />
                </div>
                <ErrorMsg target={errors.email} />

                <div className="flex gap-2 pl-2 border-2 border-grey-20 rounded-3xl mt-4 mb-4 focus-within:border-secondary-20">
                  <img src="/icons/locker.svg" />
                  <input
                    id="password"
                    type="password"
                    placeholder="비밀번호"
                    className={`${styles.inputUnset}`}
                    {...register("password", {
                      required: "비밀번호는 필수입니다.",
                    })}
                  />
                </div>
                <ErrorMsg target={errors.password} />

                <div className="flex gap-2 pl-2 border-2 border-grey-20 rounded-3xl mt-4 mb-4 focus-within:border-secondary-20">
                  <img src="/icons/locker.svg" />
                  <input
                    id="password-confirm"
                    type="password"
                    placeholder="비밀번호 확인"
                    className={`${styles.inputUnset}`}
                    {...register("password-confirm", {
                      required: "비밀번호 확인은 필수입니다.",
                    })}
                  />
                </div>
                <ErrorMsg target={errors["password-confirm"]} />
              </div>

              <button className="font-gowunBold w-full h-[48px] rounded-2xl text-center cursor-pointer box-border text-[18px] text-white bg-primary-40 focus:bg-primary-30">
                가입하기
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
