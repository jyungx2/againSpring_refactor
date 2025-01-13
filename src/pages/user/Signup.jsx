import { useForm } from "react-hook-form";
import styles from "./User.module.css";
import { useMutation } from "@tanstack/react-query";
import useAxiosInstance from "@hooks/useAxiosInstance";
import ErrorMsg from "@components/ErrorMsg";
import { useNavigate } from "react-router-dom";
import useUserStore from "@store/userStore";
import { useState } from "react";

const emailExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function Signup() {
  // Dropdown
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleClearFile = () => {
    setProfileImage(undefined);
    setValue("attach", []);
    handleOpen();
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    criteriaMode: "all",
    defaultValues: {
      name: "김이조",
      email: "kimejoa@market.com",
      password: 11111111,
      "password-confirm": 11111111,
    },
  });

  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const setUser = useUserStore((store) => store.setUser);
  const [profileImage, setProfileImage] = useState();

  const handleFileShow = (e) => {
    const file = e.target.files[0]; // 사용자가 업로드한 파일
    console.log("file: ", file);
    const watchAll = watch();
    console.log("watchAll: ", watchAll);
    console.log("watchAll.attach: ", watchAll.attach);

    if (file) {
      // 이전 URL 정리
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }

      // 새로운 URL 생성
      const newImageUrl = URL.createObjectURL(file); // 이미지 파일 미리보기 위해 파일 객체를 URL로 변환
      console.log(newImageUrl);
      // ** createObjectURL로 생성한 URL은 브라우저에서만 유효하고, 파일을 서버로 전송하려면 FormData 등을 사용해야 함 **
      setProfileImage(newImageUrl);
    }
    setIsOpen(false);
  };

  const registerUser = useMutation({
    mutationFn: async (userInfo) => {
      console.log("Initial userInfo: ", userInfo); // name, email, password, password-confirm, attach 정보가 담긴 객체

      // 프로필 이미지 등록 로직 구현
      if (userInfo.attach?.length > 0) {
        const profileFormData = new FormData();
        profileFormData.append("attach", userInfo.attach[0]); // ∵ files API: 첨부 파일 필드명은 attach로 지정해야 한다고 나와있음.

        const fileRes = await axios.post("/files", profileFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        userInfo.image = fileRes.data.item[0];
        delete userInfo.attach;
      }

      userInfo.type = "user";
      console.log("Final userInfo: ", userInfo);
      return axios.post(`/users`, userInfo);
    },
    onSuccess: async (res, userInfo) => {
      const user = res.data.item;
      console.log(user); // password 속성 존재 (undefined X)
      user.password = userInfo.password; // 굳이 해줄 필요? (안 쓰면 422 에러)
      console.log(user); // password 속성 당연히 존재

      // 로그인 요청
      const resLogin = await axios.post(`/users/login`, user);
      const userLogin = resLogin.data.item;
      delete userLogin["password-confirm"]; // 보안상 비밀번호 확인을 지움.
      console.log(userLogin);

      setUser({
        _id: userLogin._id,
        name: userLogin.name,
        profile: userLogin.image?.path,
        accessToken: userLogin.token.accessToken,
        refreshToken: userLogin.token.refreshToken,
      });

      alert("회원가입이 완료되었습니다.");
      navigate("/");
    },
    onError: (err) => {
      console.error(err);

      // 클라이언트 측에서 유효성 검사에 실패한 오류를 1차적으로 처리
      if (err.response?.data.errors) {
        err.reponse.data.errors.forEach(
          (error) => setError(error.path, { message: error.msg })
          // errors 객체를 생성하는 함수 - 객체이기 때문에 키값과 밸류값, 두가지 매개변수를 필요로 함
          // error.path === register로 설정한 field 이름
          // error.msg === 최초 검증 시점(useForm의 mode 속성값)에 따라 클라이언트 측에서 유효성 검사를 통해 발생한 메시지일 수도 있고, 클라이언트 측에서는 서버로부터 받은 오류 메시지를 setError 함수에 전달하여 폼 필드에 오류를 표시하는 역할도 하기 때문에 서버에서 설정한 오류 메시지(서버에서 정의한 유효성 검사 규칙에 따라 자동으로 생성된 메시지)일 수도 있다.
          // => 에러의 상태를 추적하고 싶다, 에러에 따라 상태값을 변경하고 싶다! 하면, 무조건 errors 객체로부터 해당되는 필드네임(ex. errors.name)을 확인하면 된다.
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
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="프로필사진 미리보기"
                    className="w-full h-full border border-grey-20 rounded-full object-cover p-1"
                  />
                ) : (
                  <div className="w-full h-full bg-[url('./icons/profile.svg')]"></div>
                )}

                <div
                  className="absolute bottom-1 right-0 rounded-full border border-grey-30 bg-white p-2 cursor-pointer"
                  onClick={handleOpen}
                >
                  <button
                    type="button"
                    className={`${styles.camera}`}
                    onClick={(e) => {
                      e.stopPropagation(); // 이벤트 버블링 방지
                      handleOpen();
                    }}
                  >
                    {isOpen && (
                      <div className="absolute left-6 top-full mt-1 p-2 shadow rounded-lg flex flex-col gap-[8px] bg-white">
                        <label
                          className="flex items-center gap-[10px] p-2 pr-8 hover:bg-sky-100 rounded cursor-pointer"
                          htmlFor="attach"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="fa-solid fa-pen"></i>
                          <span className="whitespace-nowrap">등록</span>
                          <input
                            type="file"
                            id="attach"
                            accept="image/*"
                            className="hidden"
                            {...register("attach", {
                              onChange: (e) => {
                                handleFileShow(e);
                              },
                            })}
                          />
                        </label>
                        <div
                          className="flex items-center gap-[12px] p-2 hover:bg-sky-100 rounded cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearFile();
                          }}
                        >
                          <i className="fa-regular fa-trash-can"></i>
                          <span className="whitespace-nowrap">삭제</span>
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <div
                  className={`flex gap-2 pl-2 border-2 border-grey-20 rounded-3xl mb-4 focus-within:border-secondary-20 ${
                    errors.name ? `${styles.error}` : ""
                  }`}
                >
                  <img src="/icons/user.svg" />
                  <input
                    id="name"
                    type="text"
                    placeholder="이름"
                    className={`${styles.inputUnset} ${styles.inputCustom}`}
                    {...register("name", {
                      required: "이름은 필수입니다.",
                      minLength: {
                        value: 2,
                        message: "2글자 이상 입력하세요.",
                      },
                      pattern: {
                        value: /^[^\d]*$/,
                        message: "숫자는 입력할 수 없습니다.",
                      },
                    })}
                  />
                </div>
                <ErrorMsg target={errors.name} />
              </div>
              <div className="id-collection">
                <div>
                  <div
                    className={`flex gap-2 pl-2 border-2 border-grey-20 rounded-3xl mb-4 focus-within:border-secondary-20 ${
                      errors.email ? `${styles.error}` : ""
                    }`}
                  >
                    <img src="/icons/user.svg" />
                    <input
                      id="email"
                      type="email"
                      placeholder="이메일"
                      className={`${styles.inputUnset} ${styles.inputCustom}`}
                      {...register("email", {
                        required: "이메일은 필수입니다.",
                        pattern: {
                          value: emailExp,
                          message: "이메일 양식에 맞지 않습니다.",
                        },
                      })}
                    />
                  </div>
                  <ErrorMsg target={errors.email} />
                </div>

                <div>
                  <div
                    className={`flex gap-2 pl-2 border-2 border-grey-20 rounded-3xl mt-4 mb-4 focus-within:border-secondary-20 ${
                      errors.password ? `${styles.error}` : ""
                    }`}
                  >
                    <img src="/icons/locker.svg" />
                    <input
                      id="password"
                      type="password"
                      placeholder="비밀번호"
                      className={`${styles.inputUnset} ${styles.inputCustom}`}
                      {...register("password", {
                        required: "비밀번호는 필수입니다.",
                        minLength: {
                          value: 8,
                          message: "8자리 이상 입력하세요.",
                        },
                      })}
                    />
                  </div>
                  <ErrorMsg target={errors.password} />
                </div>

                <div>
                  <div
                    className={`flex gap-2 pl-2 border-2 border-grey-20 rounded-3xl mt-4 mb-4 focus-within:border-secondary-20 ${
                      errors["password-confirm"] ? `${styles.error}` : ""
                    }`}
                  >
                    <img src="/icons/locker.svg" />
                    <input
                      id="password-confirm"
                      type="password"
                      placeholder="비밀번호 확인"
                      className={`${styles.inputUnset} ${styles.inputCustom}`}
                      {...register("password-confirm", {
                        required: "비밀번호 확인은 필수입니다.",
                        validate: (value) =>
                          value === watch("password") ||
                          "비밀번호가 일치하지 않습니다.",
                      })}
                    />
                  </div>
                  <ErrorMsg target={errors["password-confirm"]} />
                </div>
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
