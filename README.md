# 다시봄 쇼핑몰 웹사이트

## 리팩토링 이후 배포 주소: https://again-spring-jy.netlify.app/
### 1. 기존 api 서버 도메인 만료로 인한 오류 해결
✅ 변경된 API 서버 주소 및 client-id를 반영
- 기존: 11.fesp.shop
- 변경: fesp-api.koyeb.app/market

💥 단, 카카오 로그인은 현재 백엔드 서버에서의 검증 로직의 redirect_uri가 기존 배포 주소 값으로 등록되어 있어 정상동작하지 않음.  
-> 1. 카카오 개발자 콘솔에 개인적으로 앱을 등록하여 새로운 REST API Key와 redirect_uri를 설정한다해도, 실제 백엔드 서버에서의 검증에서 사용하는 값과는 다르기 때문에 오류 발생  
-> 2. 백엔드 담당하는 강사님께 redirect_uri 추가 요청드렸으나, redirect_uri 개수 제한으로 인해 현재 디버깅하지 못하는 상태입니다. 

