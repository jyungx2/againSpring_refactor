import "./main.css";

function Signup() {
  return (
    <>
      <header>HEADER</header>

      <div className="wrapper">
        <div className="content">
          <div className="login_logo_wrap">
            <a href="/">
              <img src="/public/favicon.png" alt="logo" />
            </a>
          </div>

          <div className="login_wrap">
            <form className="form">
              <div className="profile-wrap">
                <img
                  className="profile-cover"
                  src="src/pages/user/icons/profile.svg"
                />
                <img
                  className="add-cover"
                  src="src/pages/user/icons/camera.svg"
                />
              </div>

              <div className="field">
                <img src="src/pages/user/icons/user.svg" />
                <input id="username" type="text" placeholder="이름" />
              </div>

              <div className="id-collection">
                <div className="field">
                  <img src="src/pages/user/icons/user.svg" />
                  <input id="email" type="email" placeholder="이메일" />
                </div>
                <div className="field">
                  <img src="src/pages/user/icons/locker.svg" />
                  <input id="password" type="password" placeholder="비밀번호" />
                </div>
                <div className="field">
                  <img src="src/pages/user/icons/locker.svg" />
                  <input
                    id="password"
                    type="password"
                    placeholder="비밀번호 확인"
                  />
                </div>
              </div>

              <button className="button btn-signup">가입하기</button>
            </form>
          </div>
        </div>
      </div>

      <footer>FOOTER</footer>
    </>
  );
}

export default Signup;
