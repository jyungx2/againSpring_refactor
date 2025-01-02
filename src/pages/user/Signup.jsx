import "./jy-global.css";

function Signup() {
  return (
    <>
      <div className="mx-auto py-24">
        <div className="w-[460px] mx-auto flex flex-col items-center p-[18px_40px_28px] border-2 border-grey-10 rounded-[20px] gap-8">
          <div className="py-3">
            <h1 className="font-gowunBold text-5xl text-secondary-50">
              회원가입
            </h1>
          </div>

          <div className="w-[400px]">
            <form className="flex flex-col gap-6">
              <div className="relative mx-auto">
                <img
                  className="block w-full h-full"
                  src="src/pages/user/icons/profile.svg"
                />
                <img
                  className="absolute bottom-0 right-0 box-border border-2 border-grey-20 rounded-3xl p-2 bg-white"
                  src="src/pages/user/icons/camera.svg"
                />
              </div>

              <div className="flex pl-2 border-2 border-grey-20 rounded-3xl mb-6 focus-within:border-secondary-20">
                <img src="src/pages/user/icons/user.svg" />
                <input id="username" type="text" placeholder="이름" />
              </div>

              <div className="id-collection">
                <div className="flex pl-2 border-2 border-grey-20 rounded-3xl mb-4 focus-within:border-secondary-20">
                  <img src="src/pages/user/icons/user.svg" />
                  <input id="email" type="email" placeholder="이메일" />
                </div>
                <div className="flex pl-2 border-2 border-grey-20 rounded-3xl mb-4 focus-within:border-secondary-20">
                  <img src="src/pages/user/icons/locker.svg" />
                  <input id="password" type="password" placeholder="비밀번호" />
                </div>
                <div className="flex pl-2 border-2 border-grey-20 rounded-3xl mb-4 focus-within:border-secondary-20">
                  <img src="src/pages/user/icons/locker.svg" />
                  <input
                    id="password"
                    type="password"
                    placeholder="비밀번호 확인"
                  />
                </div>
              </div>

              <button className="font-gowunBold w-full h-[48px] rounded-xl text-center cursor-pointer box-border text-[20px] text-white bg-primary-40 focus:bg-primary-30">
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
