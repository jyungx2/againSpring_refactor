import styles from "./User.module.css";

function Signup() {
  return (
    <>
      <div className="mx-auto py-24">
        <div className="w-[460px] mx-auto flex flex-col items-center p-[18px_40px_28px] border-2 border-grey-10 rounded-[20px] gap-8">
          <div className="py-3">
            <h1 className="font-gowunBold text-[32px] text-grey-60">
              회원가입
            </h1>
          </div>

          <div className="w-[400px]">
            <form className="flex flex-col gap-6">
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

              <div className="flex gap-2 pl-2 border-2 border-grey-20 rounded-3xl mb-6 focus-within:border-secondary-20">
                <img src="/icons/user.svg" />
                <input
                  id="username"
                  type="text"
                  placeholder="이름"
                  className={`${styles.inputUnset}`}
                />
              </div>

              <div className="id-collection">
                <div className="flex gap-2 pl-2 border-2 border-grey-20 rounded-3xl mb-4 focus-within:border-secondary-20">
                  <img src="/icons/user.svg" />
                  <input
                    id="email"
                    type="email"
                    placeholder="이메일"
                    className={`${styles.inputUnset}`}
                  />
                </div>
                <div className="flex gap-2 pl-2 border-2 border-grey-20 rounded-3xl mb-4 focus-within:border-secondary-20">
                  <img src="/icons/locker.svg" />
                  <input
                    id="password"
                    type="password"
                    placeholder="비밀번호"
                    className={`${styles.inputUnset}`}
                  />
                </div>
                <div className="flex gap-2 pl-2 border-2 border-grey-20 rounded-3xl mb-4 focus-within:border-secondary-20">
                  <img src="/icons/locker.svg" />
                  <input
                    id="password"
                    type="password"
                    placeholder="비밀번호 확인"
                    className={`${styles.inputUnset}`}
                  />
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
