import { useForm } from "react-hook-form";
import styles from "./User.module.css";
import { useMutation } from "@tanstack/react-query";
import useAxiosInstance from "@hooks/useAxiosInstance";
import ErrorMsg from "@components/ErrorMsg";
import { useNavigate } from "react-router-dom";
import useUserStore from "@store/userStore";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

const emailExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const phoneExp = /^01[0-9]-?\d{3,4}-?\d{4}$/;

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

  const addHyphen = (event) => {
    let value = event.target.value.replace(/[^0-9]/g, ""); // 숫자만 남기기

    // 첫 번째 묶음: 3자리
    if (value.length > 3 && value.length <= 6) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    }

    // 두 번째 묶음: 4자리
    if (value.length > 7 && value.length <= 10) {
      value = value.slice(0, 7) + "-" + value.slice(7, 11);
    }

    // 세 번째 묶음: 4자리
    if (value.length > 11) {
      value = value.slice(0, 11) + "-" + value.slice(11, 15);
    }

    // 최대 11자리까지 입력되도록 처리 (하이픈 포함x)
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    event.target.value = value;

    // 유효한 값이 입력되면 오류를 지운다
    if (value.match(phoneExp)) {
      clearErrors("phone");
    }
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const setUser = useUserStore((store) => store.setUser);
  const [profileImage, setProfileImage] = useState();

  const handleFileShow = (e) => {
    const file = e.target.files[0]; // 사용자가 업로드한 파일

    if (file) {
      // 이전 URL 정리
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }

      // 새로운 URL 생성
      const newImageUrl = URL.createObjectURL(file); // 이미지 파일 미리보기 위해 파일 객체를 URL로 변환
      setProfileImage(newImageUrl);
    }
    setIsOpen(false);
  };

  const registerUser = useMutation({
    mutationFn: async (userInfo) => {
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
      user.password = userInfo.password; // 굳이 해줄 필요? (안 쓰면 422 에러)

      // 로그인 요청
      const resLogin = await axios.post(`/users/login`, user);
      const userLogin = resLogin.data.item;
      delete userLogin["password-confirm"]; // 보안상 비밀번호 확인을 지움.

      setUser({
        _id: userLogin._id,
        name: userLogin.name,
        type: userLogin.type,
        profile: userLogin.image?.path,
        accessToken: userLogin.token.accessToken,
        refreshToken: userLogin.token.refreshToken,
        phone: userLogin.phone,
        address: userLogin.address,
      });

      alert("회원가입이 완료되었습니다.");
      navigate("/");
    },
    onError: (err) => {
      console.error(err);

      // 클라이언트 측에서 유효성 검사에 실패한 오류를 1차적으로 처리
      if (err.response?.data.errors) {
        err.reponse.data.errors.forEach((error) =>
          setError(error.path, { message: error.msg })
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
      <Helmet>
        <title>다시, 봄 - 회원가입</title>
        <meta property="og:title" content="다시봄 회원가입" />
        <meta
          property="og:description"
          content="지금 다시봄 회원가입하고 특별한 할인과 다양한 서비스를 누리세요!"
        />
      </Helmet>

      <div className="box-border max-w-[1200px] my-[60px] px-6 mx-auto">
        <div className="w-[460px] mx-auto flex flex-col items-center p-[18px_40px_28px] border-2 border-grey-10 rounded-[20px] gap-8">
          <div className="py-3">
            <h1 className="font-gowunBold text-[32px] text-grey-60">
              회원가입
            </h1>
          </div>

          <div className="w-[400px]">
            <form
              // form 내부의 모든 register()된 input 값들을 자동으로 수집해서,
              // registerUser.mutate(formValues) 이렇게 그 값들을 인자로 넘겨준다 -> getValues() 안 써줘도 OK (인증 → 회원가입 단계적인 가입과정에서는 getValues 필요!!)
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
                  <div className="w-full h-full bg-[url('/icons/profile.svg')]"></div>
                )}

                <div
                  className="absolute bottom-1 right-0 rounded-full border border-grey-30 bg-white p-2 cursor-pointer "
                  onClick={handleOpen}
                >
                  <button type="button" className={`${styles.camera}`}>
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
                          onClick={handleClearFile}
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
                    <img className="px-[6px]" src="/icons/mail.svg" />
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

              <div>
                <div>
                  <div
                    className={`flex gap-2 pl-2 border-2 border-grey-20 rounded-3xl mt-4 mb-4 focus-within:border-secondary-20 ${
                      errors.phone ? `${styles.error}` : ""
                    }`}
                  >
                    <img src="/icons/phone.svg" className="p-[6px]" />
                    <input
                      id="phone"
                      type="string"
                      placeholder="휴대전화번호"
                      className={`${styles.inputUnset} ${styles.inputCustom}`}
                      {...register("phone", {
                        onChange: addHyphen,
                        required: "휴대전화번호 입력은 필수입니다.",
                        pattern: {
                          value: phoneExp,
                          message: "전화번호 양식에 맞지 않습니다.",
                        },
                      })}
                    />
                  </div>
                  <ErrorMsg target={errors.phone} />
                </div>
                <div>
                  <div
                    className={`flex gap-2 pl-2 border-2 border-grey-20 rounded-3xl mt-4 mb-4 focus-within:border-secondary-20 ${
                      errors.address ? `${styles.error}` : ""
                    }`}
                  >
                    <img src="/icons/address.svg" className="p-[6px]" />
                    <input
                      id="address"
                      type="string"
                      placeholder="[선택] 도로명주소"
                      className={`${styles.inputUnset} ${styles.inputCustom}`}
                      {...register("address")}
                    />
                  </div>
                </div>
              </div>

              <button className="font-gowunBold mt-4 w-full h-[48px] rounded-2xl text-center cursor-pointer box-border text-[18px] text-white bg-primary-40 focus:bg-primary-30">
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
