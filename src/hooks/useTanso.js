import useTansoStore from "../store/tansoStore";

const useTanso = () => {
  const {
    electricity,
    gas,
    water,
    transportation,
    waste,
    transportType,
    setField,
  } = useTansoStore();

  const inputs = [
    { id: "electricity", label: "전기 사용량 (kWh)", value: electricity },
    { id: "gas", label: "가스 사용량 (m³)", value: gas },
    { id: "water", label: "수도 사용량 (L)", value: water },
    { id: "transportation", label: "교통 거리 (km)", value: transportation },
    { id: "waste", label: "폐기물 배출량 (kg)", value: waste },
  ];

  const transportFactors = {
    gasoline: (distance) => (distance / 16.04) * 2.097,
    diesel: (distance) => (distance / 15.35) * 2.582,
    lpg: (distance) => (distance / 11.06) * 1.868,
    none: () => 0,
  };

  const calculateCO2 = () => {
    const transportCO2 =
      transportFactors[transportType](transportation) || 0;

    return (
      electricity * 0.4781 +
      gas * 2.176 +
      water * 0.237 +
      waste * 0.5573 +
      transportCO2
    ).toFixed(2);
  };

  return { inputs, setField, calculateCO2, transportType };
};

export default useTanso;
