import "./main.css";
import "./jy-global.css";

function Myreview() {
  return (
    <>
      <div className="mx-w-[1580px] mx-auto p-[24px] pb-0">
        <div className="flex">
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
            <div className="section top">
              <img src="src/pages/user/icons/basket.svg" />
              <div className="first-depth">
                <h1>상품리뷰</h1>
                <p>상품의 품질에 대해서 얼마나 만족하시나요?</p>
              </div>
            </div>
            <div className="section second">
              <img src="src/pages/user/icons/image.png" />
              <div className="second-depth">
                <p className="product-name">안티 헤어 로스 샴푸바</p>
                <p>12,900원 - 1개</p>
              </div>
            </div>
            <div className="section">
              <h2 className="fix">상세리뷰</h2>
              <div className="field">
                <textarea
                  rows="10"
                  placeholder="다른 고객님에게 도움이 되도록 상품에 대한 솔직한 평가를 남겨주세요."
                ></textarea>
              </div>
            </div>
            <div className="section">
              <h2>사진첨부</h2>
              <button className="button">사진 첨부하기</button>
            </div>

            <div className="btn-section">
              <button className="btn btn-cancel">취소</button>
              <button className="btn btn-register">등록</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Myreview;
