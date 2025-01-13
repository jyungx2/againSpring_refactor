import useTansoStore from "../store/tansoStore";

const useTanso = () => {
  const {
    electricity,
    gas,
    water,
    transportation,
    waste,
    setField,
  } = useTansoStore();

  const inputs = [
    { id: "electricity", label: "전기 사용량 (kWh)", value: electricity },
    { id: "gas", label: "가스 사용량 (m³)", value: gas },
    { id: "water", label: "수도 사용량 (L)", value: water },
    { id: "transportation", label: "교통 거리 (km)", value: transportation },
    { id: "waste", label: "폐기물 배출량 (kg)", value: waste },
  ];

  const calculateCO2 = () => {
    return (
      electricity * 0.233 +
      gas * 0.150 +
      water * 0.120 +
      transportation * 0.200 +
      waste * 0.100
    ).toFixed(2);
  };

  return { inputs, setField, calculateCO2 };
};

export default useTanso;
