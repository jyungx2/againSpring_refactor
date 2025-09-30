import { useForm } from "react-hook-form";
import styles from "./User.module.css";
import { useNavigate } from "react-router-dom";

function TermsOfService() {
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      "terms-required": false,
      "personal-required": false,
      "SMS-optional": false,
      "Email-optional": false,
    },
  });
  const watchAll = watch();

  const allChecked = Object.values(watchAll).every(Boolean); // watch 객체의 value값들이 모두 true값을 갖고 있다면 true 반환..
  const isOkayToNext =
    watchAll["terms-required"] && watchAll["personal-required"];

  const onSubmit = (data) => {
    console.log("이용약관 체크 상태: ", data);
  };

  const handleCheckAll = (e) => {
    const isChecked = e.target.checked;
    Object.keys(watchAll).forEach((key) => {
      setValue(key, isChecked); // setValue를 사용해 각 체크박스의 값을 업데이트 - 매개변수 2개: (필드 이름, 설정할 값)
    });
  };

  const handleNext = () => {
    navigate("/signup");
    window.scrollTo(0, 0); // 회원가입 페이지로 이동 시, 스크롤된 상태로 이동하는 것을 막음
  };

  return (
    <>
      <div className="box-border px-6 my-[60px] mx-auto max-w-[600px] flex flex-col gap-[20px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[32px] text-[18px]"
        >
          <div className="flex">
            <input
              type="checkbox"
              id="check"
              className={`peer ${styles.inputUnset} ${styles.checkboxCustom}`}
              onChange={handleCheckAll}
              checked={allChecked}
            />
            <label
              className="flex gap-4 cursor-pointer items-end before:w-[20px] before:h-[20px] before:inline-block before:content-[''] before:bg-[url('/icons/emptybox.svg')] peer-checked:before:bg-[url('/icons/checkbox.svg')] font-gowunBold text-[18px]"
              htmlFor="check"
            >
              전체 동의하기
            </label>
          </div>

          <div>
            <div className="flex">
              <input
                type="checkbox"
                id="termsService"
                className={`peer ${styles.inputUnset} ${styles.checkboxCustom}`}
                {...register("terms-required", { required: true })}
              />
              <label
                className="flex gap-4 cursor-pointer items-end before:w-[20px] before:h-[20px] before:inline-block before:content-[''] before:bg-[url('/icons/emptybox.svg')] peer-checked:before:bg-[url('/icons/checkbox.svg')] font-gowunBold text-[18px]"
                htmlFor="termsService"
              >
                이용약관 동의
                <em
                  className={`${styles.emUnset} inline-block font-gowunBold text-[14px] text-error`}
                >
                  (필수)
                </em>
              </label>
            </div>
            <div className="border border-[#ddd] mt-6 ml-8 rounded-lg p-[18px] max-h-[100px] overflow-auto box-border text-[15px] tracking-wider">
              <div className="mb-4">
                <h1 className="text-[18px] font-gowunBold">
                  여러분을 환영합니다.
                </h1>
                <p className="mt-[10px] leading-[20px]">
                  다시봄 서비스 및 제품(이하 ‘서비스’)을 이용해 주셔서
                  감사합니다. 본 약관은 다양한 다시봄 서비스의 이용과 관련하여
                  다시봄 서비스를 제공하는 다시봄 주식회사(이하 ‘다시봄’)와 이를
                  이용하는 다시봄 서비스 회원(이하 ‘회원’) 또는 비회원과의
                  관계를 설명하며, 아울러 여러분의 다시봄 서비스 이용에 도움이
                  될 수 있는 유익한 정보를 포함하고 있습니다. 다시봄 서비스를
                  이용하시거나 다시봄 서비스 회원으로 가입하실 경우 여러분은 본
                  약관 및 관련 운영 정책을 확인하거나 동의하게 되므로, 잠시
                  시간을 내시어 주의 깊게 살펴봐 주시기 바랍니다.
                </p>
              </div>

              <div className="mb-4">
                <h1 className="text-[18px] font-gowunBold">
                  다양한 다시봄 서비스를 즐겨보세요.
                </h1>
                <p className="mt-[10px] leading-[20px]">
                  다시봄는 www.naver.com을 비롯한 다시봄 도메인의 웹사이트 및
                  응용프로그램(어플리케이션, 앱)을 통해 정보 검색, 다른
                  이용자와의 커뮤니케이션, 콘텐츠 제공, 상품 쇼핑 등 여러분의
                  생활에 편리함을 더할 수 있는 다양한 서비스를 제공하고
                  있습니다. 여러분은 PC, 휴대폰 등 인터넷 이용이 가능한 각종
                  단말기를 통해 각양각색의 다시봄 서비스를 자유롭게 이용하실 수
                  있으며, 개별 서비스들의 구체적인 내용은 각 서비스 상의 안내,
                  공지사항, 다시봄 웹고객센터(이하 ‘고객센터’) 도움말 등에서
                  쉽게 확인하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex">
              <input
                type="checkbox"
                id="termsPrivacy"
                className={`peer ${styles.inputUnset} ${styles.checkboxCustom}`}
                {...register("personal-required", { required: true })}
              />
              <label
                className="flex gap-4 cursor-pointer items-end before:w-[20px] before:h-[20px] before:inline-block before:content-[''] before:bg-[url('/icons/emptybox.svg')] peer-checked:before:bg-[url('/icons/checkbox.svg')] font-gowunBold text-[18px]"
                htmlFor="termsPrivacy"
              >
                개인정보 수집 및 이용 동의
                <em
                  className={`${styles.emUnset} inline-block font-gowunBold text-[14px] text-error`}
                >
                  (필수)
                </em>
              </label>
            </div>
            <div className="border border-[#ddd] mt-6 ml-8 rounded-lg p-[18px] max-h-[100px] overflow-auto box-border text-[15px] tracking-wider">
              <div className="mb-4">
                <h1 className="text-[18px] font-gowunBold">
                  1. 수집하는 개인정보
                </h1>
                <p className="mt-[10px] leading-[20px]">
                  개인정보보호법에 따라 다시봄에 회원가입 신청하시는 분께
                  수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적,
                  개인정보의 보유 및 이용기간, 동의 거부권 및 동의 거부 시
                  불이익에 관한 사항을 안내 드리오니 자세히 읽은 후 동의하여
                  주시기 바랍니다.
                </p>
                <p className="mt-[10px] leading-[20px]">
                  이용자는 회원가입을 하지 않아도 정보 검색, 뉴스 보기 등
                  대부분의 다시봄 서비스를 회원과 동일하게 이용할 수 있습니다.
                  이용자가 메일, 캘린더, 카페, 블로그 등과 같이 개인화 혹은
                  회원제 서비스를 이용하기 위해 회원가입을 할 경우, 다시봄는
                  서비스 이용을 위해 필요한 최소한의 개인정보를 수집합니다.
                </p>
                <p className="mt-[10px] leading-[20px]">
                  회원가입 시점에 다시봄이 이용자로부터 수집하는 개인정보는
                  아래와 같습니다.
                </p>
                <p className="mt-[10px] leading-[20px] block">
                  - 회원 가입 시 필수항목으로 아이디, 비밀번호, 이름, 생년월일,
                  성별, 휴대전화번호를, 선택항목으로 본인확인 이메일주소를
                  수집합니다. 실명 인증된 아이디로 가입 시, 암호화된 동일인
                  식별정보(CI), 중복가입 확인정보(DI), 내외국인 정보를 함께
                  수집합니다. 만 14세 미만 아동의 경우, 법정대리인의 동의를 받고
                  있으며, 휴대전화번호 또는 아이핀 인증을 통해 법정대리인의
                  동의를 확인하고 있습니다. 이 과정에서 법정대리인의
                  정보(법정대리인의 이름, 중복가입확인정보(DI),
                  휴대전화번호(아이핀 인증인 경우 아이핀번호))를 추가로
                  수집합니다.
                </p>
                <p className="mt-[10px] leading-[20px] block">
                  - 비밀번호 없이 회원 가입 시에는 필수항목으로 아이디, 이름,
                  생년월일, 휴대전화번호를, 선택항목으로 비밀번호를 수집합니다.{" "}
                </p>
                <p className="mt-[10px] leading-[20px]">
                  서비스 이용 과정에서 이용자로부터 수집하는 개인정보는 아래와
                  같습니다.
                  <p className="mt-[10px] leading-[20px] block">
                    - 회원정보 또는 개별 서비스에서 프로필 정보(별명, 프로필
                    사진)를 설정할 수 있습니다. 회원정보에 별명을 입력하지 않은
                    경우에는 마스킹 처리된 아이디가 별명으로 자동 입력됩니다.
                  </p>
                  <p className="mt-[10px] leading-[20px] block">
                    - 다시봄 내의 개별 서비스 이용, 이벤트 응모 및 경품 신청
                    과정에서 해당 서비스의 이용자에 한해 추가 개인정보 수집이
                    발생할 수 있습니다. 추가로 개인정보를 수집할 경우에는 해당
                    개인정보 수집 시점에서 이용자에게 ‘수집하는 개인정보 항목,
                    개인정보의 수집 및 이용목적, 개인정보의 보관기간’에 대해
                    안내 드리고 동의를 받습니다.
                  </p>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[30px]">
            <label className="flex gap-4 items-end font-gowunBold text-[18px]">
              마케팅 활용 동의 및 광고 수신 동의
              <em
                className={`${styles.emUnset} inline-block font-gowunBold text-[14px] text-grey-50`}
              >
                (선택)
              </em>
            </label>
            <div className="flex flex-col gap-6 text-[16px]">
              <div className="flex">
                <input
                  type="checkbox"
                  id="termsSMS"
                  className={`peer ${styles.inputUnset} ${styles.checkboxCustom}`}
                  {...register("SMS-optional")}
                />
                <label
                  className="flex gap-4 items-center cursor-pointer before:w-[20px] before:h-[20px] before:inline-block before:content-[''] before:bg-[url('/icons/emptybox.svg')] peer-checked:before:bg-[url('/icons/checkbox.svg')]"
                  htmlFor="termsSMS"
                >
                  SMS 수신 동의
                </label>
              </div>

              <div className="flex">
                <input
                  type="checkbox"
                  id="termsEmail"
                  className={`peer ${styles.inputUnset} ${styles.checkboxCustom}`}
                  {...register("Email-optional")}
                />
                <label
                  className="flex gap-4 items-center cursor-pointer before:w-[20px] before:h-[20px] before:inline-block before:content-[''] before:bg-[url('/icons/emptybox.svg')] peer-checked:before:bg-[url('/icons/checkbox.svg')]"
                  htmlFor="termsEmail"
                >
                  E-mail 수신 동의
                </label>
              </div>

              <div className="border border-[#ddd] mt-6 ml-8 rounded-lg p-[18px] max-h-[100px] overflow-auto box-border text-[15px] tracking-wider">
                <div>
                  <p className="leading-[20px]">
                    서비스와 관련된 소식, 이벤트 안내, 고객 혜택 등 다양한
                    정보를 제공합니다.
                  </p>
                  <p className="leading-[20px]">
                    다시봄에서 진행하는 행사 소식을 가장 빠르게 받아보실 수
                    있습니다!
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center p-[30px] border-t border-grey-30">
            <button
              type="button"
              disabled={!isOkayToNext}
              className="bg-primary-40 inline-block text-4 text-white h-[48px] leading-[48px] w-full box-border cursor-pointer rounded-[12px] btn-register flex-shrink-0 font-gowunBold disabled:bg-grey-30 focus:bg-primary-30"
              onClick={handleNext}
            >
              동의하기
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default TermsOfService;
