export async function maintenanceLoader() {
  // 페이지를 의도적으로 503 에러 발생 - loader가 항상 503 에러를 던지도록 처리 (페이지 점검할 때 사용)
  throw new Response("Service Unavailable", { status: 503 });
}