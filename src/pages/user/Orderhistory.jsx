import "./main.css";

function Orderhistory() {
  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className="sidebar">
            <a>주문조회</a>
            <a>1:1 문의</a>
            <a>위시리스트</a>
            <a>쿠폰</a>
            <a>포인트</a>
            <a>정보 수정</a>
            <a>회원탈퇴</a>
          </div>

          <div className="main">
            <div className="user-interface">
              <div className="first">
                <img
                  className="profile-cover"
                  src="src/pages/user/icons/profile.svg"
                />
                <p>이지영님 안녕하세요.</p>
              </div>

              <div className="mileage-wrap">
                <div className="second">
                  <h4>포인트</h4>
                  <span>0</span>
                </div>
                <div className="second">
                  <h4>쿠폰</h4>
                  <span>2</span>
                </div>
              </div>
            </div>

            <div className="order-list-wrap">
              <div>
                <h1 className="order-list-header">주문 목록</h1>
              </div>

              <div className="order-list-content">
                <div className="order-list-title">
                  <p className="title-order-date">2024.12.25 주문</p>
                  <div className="detail">
                    <p className="title-see-detail">주문 상세보기</p>
                    <img src="src/pages/user/icons/pointer.svg" />
                  </div>
                </div>

                <div className="order-list-card">
                  <div className="subtitle">
                    <div className="order-list-date">
                      주문완료 - <span>12/30 (목) 도착</span>
                    </div>
                    <img src="src/pages/user/icons/dots.svg" />
                  </div>

                  <div className="order-list-info">
                    <img src="src/pages/user/icons/image.png" />
                    <div className="order-list-detail">
                      <p>안티 헤어 로스 샴푸바</p>
                      <p>12,900원 - 1개</p>
                    </div>
                  </div>
                </div>

                <div className="order-list-card">
                  <div className="subtitle">
                    <div className="order-list-date">
                      주문완료 - <span>12/30 (목) 도착</span>
                    </div>
                    <img src="src/pages/user/icons/dots.svg" />
                  </div>

                  <div className="order-list-info">
                    <img src="src/pages/user/icons/image.png" />
                    <div className="order-list-detail">
                      <p>안티 헤어 로스 샴푸바</p>
                      <p>12,900원 - 1개</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Orderhistory;
