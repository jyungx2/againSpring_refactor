import "./main.css";

function Myquery() {
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
            <div className="l_section top">
              <div className="img-section">
                <img src="src/pages/user/icons/query.svg" />
              </div>

              <div className="first-depth">
                <h1>문의 내역 확인</h1>
                <div className="btn-section">
                  <button className="button">문의하러 가기</button>
                </div>
              </div>
            </div>

            <div className="l_section middle">
              <h2>문의내역</h2>

              <table>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성일</th>
                    <th>작성자</th>
                    <th>조회수</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>1</td>
                    <td>배송은 보통 며칠 걸리나요?</td>
                    <td>2024-12-02</td>
                    <td>국연수</td>
                    <td>2</td>
                  </tr>

                  <tr>
                    <td>2</td>
                    <td>교환이나 환불 신청은 며칠 이내로 해야 하나요?</td>
                    <td>2024-12-20</td>
                    <td>국연수</td>
                    <td>8</td>
                  </tr>

                  <tr>
                    <td>2</td>
                    <td>유통기한이 언제까지 인가요?</td>
                    <td>2024-12-20</td>
                    <td>국연수</td>
                    <td>8</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="l_section bottom">
              <button className="btn btn-cancel">취소</button>
              <button className="btn btn-register">등록</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Myquery;
