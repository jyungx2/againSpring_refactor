## 🌿 다시봄 (Again Spring)
친환경 제품 전문 쇼핑몰 ‘자연상점’을 참고하여 제작한 ‘다시봄’은 지속 가능한 소비를 촉진하고,</br>
“다시 지구에 봄이 오길 바란다”는 의미를 담아 기획한 친환경 쇼핑몰 웹사이트
> 👉 사이트 바로가기: https://next-urang-market.vercel.app/</br>
> 👉 프로젝트 상세보기: https://my-portfolio-three-xi-44.vercel.app/blog/again-spring</br>

---
## ❗NOTICE️ 
#### ⚠️ 1. 카카오 로그인 관련 이슈
현재 카카오 로그인 기능은 백엔드 서버의 검증 로직에서 사용하는 redirect_uri가  
기존 배포 주소로만 등록되어 있어, 새로운 배포 주소에서는 정상적으로 동작하지 않습니다.
  > 🔍 해결 시도 및 경과    
  > 1. 카카오 개발자 콘솔에 개인 앱을 등록하고, 새로운 REST API Key 및 redirect_uri를 설정하였으나   
  > → 백엔드 검증 시 사용되는 값과 일치하지 않아 인증 오류 발생
  > 2. 백엔드 담당 강사님께 새로운 redirect_uri 추가를 요청드렸으나,  
  > → 현재 서버의 redirect URI 등록 개수 제한으로 인해 수정 대기 중
  <br>
  <br>

#### ⚠️ 2. 상품 상세 페이지 & 장바구니 페이지 - 주문 생성 API(POST /orders) 일시적 오류 및 백엔드 점검 중
  현재 주문 생성 API(POST /orders) 요청 과정에서 일시적인 오류가 발생하여</br>
  ‘상품 상세’ 페이지와 ‘장바구니’ 페이지의 주문 요청 기능이 일시적으로 중단된 상태입니다.</br>
 
  이에 따라 로그인 및 결제 기능의 디버깅이 제한되고 있으며,</br>
  결제 후 마이페이지 내 결제 내역·문의 내역·후기 조회 기능은 아래 영상을 참고해주시기 바랍니다.</br>
  
  🎥[영상 바로가기](https://drive.google.com/file/d/10B2M8rt8dXfDkSJ16ssPAHSaCW2nvQAD/view) 
  > 💬 1.25배속 또는 1.5배속으로 시청하시면 더욱 효율적으로 확인하실 수 있습니다.
  <br>
  <br>

#### ✅ 3. 기존 api 서버 도메인 만료로 인한 오류 해결  
   변경된 API 서버 주소 및 client-id를 반영하여 상품 목록, 상세 조회, 장바구니 등 주요 기능이 정상적으로 복구되었습니다.
   - 기존: 11.fesp.shop
   - 변경: fesp-api.koyeb.app/market

---

## 🧭 기술 스택
  - Frontend: React, Javascript
  - Styling: Tailwind CSS, CSS Modules
  - State Management: Zustand
  - Deployment: Netlify
  - Image Upload: Cloudinary
  
---

## 🚀 주요 구현 기능
#### 1. 담당 파일
  - pages
    - user/*
    - Checkout.jsx
  
  - components
    - ProtectedRoute.jsx
    - ErrorMsg.jsx
    - PurchaseButton.jsx
  
  - store
    - userStore.js

  - hooks
    - useAxiosInstance.js

   ---

#### 2. 담당 구현 기능
- 로그인/회원가입
  - 회원가입 후 로그인 시, 인증 정보를 **세션 스토리지(SessionStorage)** 에 저장하도록 구현하였습니다.
  - 자동로그인 옵션 클릭 후 로그인 시, **Zustand 미들웨어의** setOptions **API**를 활용하여 세션 스토리지 또는 로컬 스토리지를 **동적으로 설정할 수 있도록 하였습니다.**
  - 자동 로그인을 선택한 사용자는 회원 정보가 **로컬 스토리지(LocalStorage)** 에 저장되며, 이후 페이지 재접속 시 브라우저의 로컬 스토리지로부터 정보를 불러와 **자동 인증되도록 구현하였습니다.**

- 주문 내역 조회 및 후기 작성
  - 주문 내역 페이지에서 **‘리뷰 작성하기’ 버튼** 클릭 시, 해당 상품에 대한 상세 리뷰를 작성하고 사진을 첨부할 수 있도록 구현하였습니다.
  - 작성한 리뷰는 **상품 상세페이지의 리뷰 목록 및 후기 조회 페이지에 즉시 반영**됩니다.
 
  <div align="center" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
    <img src="https://github.com/user-attachments/assets/78a9f5e6-aa01-450f-8f94-c2f5c7d7463d" width="280" alt="image 1"/>
    <img src="https://github.com/user-attachments/assets/cab39563-b296-4e28-af1d-7e2e4706e333" width="280" alt="image 2"/>
    <img src="https://github.com/user-attachments/assets/4d1bfd7d-8c89-49b4-8d31-886608cbd454" width="280" alt="image 3"/>
  </div>


- 문의 내역 조회
  - 사용자 경험(UX)을 고려하여 **페이지네이션(Pagination)** 기능을 구현하였습니다.
  - **‘문의하러 가기’ 버튼** 클릭 시 /qna 페이지로 이동하여 새로운 문의를 작성할 수 있도록 하였습니다.
 
    <img width="450" height="240" alt="image 5" src="https://github.com/user-attachments/assets/de49a26b-4a40-4f13-bee3-5692acd2bed0" />

- 후기 내역 조회
  - 사용자가 작성한 상품 리뷰를 한눈에 확인할 수 있도록 구현하였습니다.
  - 각 리뷰에는 작성 시점과 상품 정보가 함께 표시되어 본인이 남긴 후기 기록을 직관적으로 확인할 수 있도록 하였습니다.
    
    <img width="450" height="240" alt="image 4" src="https://github.com/user-attachments/assets/d3ef1d12-0ac3-4654-9013-90f5f16f9428" />


