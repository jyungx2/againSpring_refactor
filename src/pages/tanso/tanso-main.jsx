import useTansoStore from "../../store/tansoStore";

const TansoMain = () => {
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

  return (
    <div className="bg-grey-5 min-h-screen py-8 px-4 font-gowun">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-4xl font-gowunBold text-primary-50 mb-6">
          탄소 발자국 계산기
        </h1>
        <p className="text-grey-60 mb-6">
          당신의 생활에서 탄소 발자국을 계산하고, 줄일 방법을 찾아보세요.
        </p>
        <div className="space-y-6">
          {inputs.map(({ id, label, value }) => (
            <div key={id} className="flex items-center justify-between">
              <label
                htmlFor={id}
                className="text-lg font-medium text-primary-70 w-1/2"
              >
                {label}
              </label>
              <input
                type="number"
                id={id}
                value={value}
                onChange={(e) => setField(id, parseFloat(e.target.value) || 0)}
                className="w-1/3 border border-grey-20 rounded p-2 text-center"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => alert(`총 CO₂ 배출량: ${calculateCO2()} kg`)}
          className="mt-6 bg-primary-50 text-white py-2 px-4 rounded hover:bg-primary-70"
        >
          계산하기
        </button>
        <div className="mt-4 text-lg font-medium text-secondary-20">
          총 CO₂ 배출량: {calculateCO2()} kg
        </div>
      </div>
    </div>
  );
};

export default TansoMain;
