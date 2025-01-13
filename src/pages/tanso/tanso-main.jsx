import useTanso from "@hooks/useTanso";

const TansoMain = () => {
  const { inputs, setField, calculateCO2, transportType } = useTanso();

  const transportOptions = [
    { id: "gasoline", label: "휘발유" },
    { id: "diesel", label: "경유" },
    { id: "lpg", label: "LPG" },
    { id: "none", label: "승용차 없음" },
  ];

  return (
    <div className="bg-grey-5 w-[1200px] mx-auto px-6 py-8 font-gowun">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-4xl font-gowunBold text-primary-50 mb-6">
          탄소 발자국 계산기
        </h1>
        <p className="text-grey-60 mb-6">
          다시, 봄에서 상품을 구매하셨나요? 탄소 발자국을 계산해보세요!
        </p>
        <div className="space-y-6">
          {inputs
            .filter(({ id }) => id !== "transportation")
            .map(({ id, label, value }) => (
              <div
                key={id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
              >
                <label
                  htmlFor={id}
                  className="text-lg font-medium text-primary-70 block mb-2"
                >
                  {label}
                </label>
                <input
                  type="number"
                  id={id}
                  value={value}
                  onChange={(e) => setField(id, parseFloat(e.target.value) || 0)}
                  className="w-full border border-grey-20 rounded p-2 text-center"
                />
              </div>
            ))}

          {/* 교통수단 선택 */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium text-primary-70 mb-4">교통</h3>
            <div className="flex space-x-4 mb-4">
              {transportOptions.map(({ id, label }) => (
                <label key={id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="transportType"
                    value={id}
                    checked={transportType === id}
                    onChange={(e) => setField("transportType", e.target.value)}
                    className="form-radio text-primary-50"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <label
              htmlFor="transportation"
              className="text-lg font-medium text-primary-70 block mb-2"
            >
              교통 거리 (km)
            </label>
            <input
              type="number"
              id="transportation"
              value={
                inputs.find((input) => input.id === "transportation")?.value || 0
              }
              onChange={(e) =>
                setField("transportation", parseFloat(e.target.value) || 0)
              }
              className="w-full border border-grey-20 rounded p-2 text-center"
            />
          </div>
        </div>
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => alert(`총 CO₂ 배출량: ${calculateCO2()} kg`)}
            className="bg-primary-50 text-white py-2 px-4 rounded hover:bg-primary-70"
          >
            계산하기
          </button>
          <button className="bg-primary-50 text-white py-2 px-4 rounded hover:bg-primary-70">
            총 결과 보기
          </button>
          <button className="bg-primary-50 text-white py-2 px-4 rounded hover:bg-primary-70">
            생활 속 실천 방안
          </button>
        </div>
        <div className="mt-4 text-lg font-medium text-secondary-20">
          총 CO₂ 배출량: {calculateCO2()} kg
        </div>
      </div>
    </div>
  );
};

export default TansoMain;
