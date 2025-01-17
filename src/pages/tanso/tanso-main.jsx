import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useQuery } from "@tanstack/react-query";

const CarbonFootprint = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();
  const [carbonFootprint, setCarbonFootprint] = useState(0);

  // 회원 정보 가져오기
  const { data: user, isLoading: userLoading, isError: userError } = useQuery({
    queryKey: ["user"],
    queryFn: () => axiosInstance.get("/users").then((res) => res.data),
    onError: (error) => {
      console.error("회원 정보 가져오기 실패:", error);
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  // 탄소 수치 계산
  useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () =>
      axiosInstance
        .get(`/orders?userId=${user.id}`)
        .then((res) =>
          res.data.reduce((total, order) => {
            return (
              total +
              order.products.reduce(
                (subtotal, product) =>
                  subtotal + product.extra.tanso * product.quantity,
                0
              )
            );
          }, 0)
        ),
    enabled: !!user,
    onSuccess: (data) => setCarbonFootprint(data),
    onError: (error) => {
      console.error("탄소 수치 계산 실패:", error);
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  // 비회원 처리
  if (userError) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>회원 정보를 불러오지 못했습니다.</h2>
        <p>로그인이 필요합니다.</p>
        <button onClick={() => navigate("/login")} style={{ marginTop: "20px" }}>
          로그인 하러 가기
        </button>
      </div>
    );
  }

  if (!user && !userLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>회원 전용 서비스입니다.</h2>
        <p>탄소 발자국 계산기는 회원 가입 후 이용 가능합니다.</p>
        <button onClick={() => navigate("/signup")} style={{ marginTop: "20px" }}>
          회원가입 하러 가기
        </button>
      </div>
    );
  }

  if (userLoading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{user.name}님, 지금까지 발생한 탄소 발자국</h1>
      <div
        style={{
          margin: "20px 0",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          textAlign: "center",
        }}
      >
        <p>
          <strong>{carbonFootprint} kg CO₂</strong>
        </p>
        <p>탄소 발자국을 계산하여 얼마나 발생했는지 확인해보세요!</p>
      </div>
    </div>
  );
};

export default CarbonFootprint;
