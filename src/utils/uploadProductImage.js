// 다슬님이 Quill Editor에서 이미지 업로드를 위해 사용한 코드를 참고하여 작성하였습니다. 감사합니다!!

export async function uploadProductImage(file) { // 이미지 업로드 함수
  const formData = new FormData(); // FormData 객체 생성
  formData.append('attach', file); // 'attach' 키로 파일 추가

  try { // 이미지 업로드 요청
    const response = await fetch('https://11.fesp.shop/files', { // 이미지 업로드 API 주소
      method: 'POST', // POST 메소드
      body: formData, // FormData 객체 전송
      headers: { // 헤더 설정
        'client-id': 'final02', // 클라이언트 ID
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // 엑세스 토큰
      },
    });

    const result = await response.json(); // 응답 JSON 변환
    return `${result.item[0].path}`; // 이미지 URL 반환
  } catch (error) { // 에러 처리
    console.error('상품 이미지 업로드 실패:', error); // 에러 메시지 출력
    throw error; // 에러 반환
  }
}
