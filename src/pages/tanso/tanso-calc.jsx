import useTanso from "@hooks/useTanso";

const TansoMain = () => {
  const { inputs, setField, calculateCO2, transportType } = useTanso();

  const transportOptions = [
    { id: "gasoline", label: "휘발유" },
    { id: "diesel", label: "경유" },
    { id: "lpg", label: "LPG" },
    { id: "walking", label: "도보" }, // 수정: 승용차 없음 -> 도보
  ];

  return (
    <div className="bg-grey-5 w-[1200px] mx-auto px-6 py-8 font-gowun">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-4xl font-gowunBold text-primary-50 mb-6 text-center">
          탄소 발자국 계산기
        </h1>
        <p className="text-grey-60 mb-6 text-center">
          다시, 봄에서 상품을 구매하셨나요? 탄소 발자국을 계산해보세요!
        </p>
        <div className="space-y-6">
          {inputs
            .filter(({ id }) => id !== "transportation")
            .map(({ id, label, value, formula }) => (
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
                {/* 계산식 표시 */}
                <p className="text-sm text-grey-50 mt-2">
                  계산식: {formula || "관련 데이터 기반으로 계산됩니다."}
                </p>
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
              disabled={transportType === "walking"} // 도보 선택 시 비활성화
            />
            {transportType === "walking" && (
              <p className="text-sm text-grey-50 mt-2">
                도보로 이동 시 거리는 고려되지 않습니다.
              </p>
            )}
          </div>
        </div>

        {/* 계산하기 버튼 */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => alert(`총 CO₂ 배출량: ${calculateCO2()} kg`)}
            className="bg-primary-50 text-white py-4 px-8 rounded-lg hover:bg-primary-70 text-lg font-bold"
          >
            계산하기
          </button>
        </div>
        <div className="mt-8 text-lg font-medium text-secondary-20 text-center">
          총 CO₂ 배출량: {calculateCO2()} kg
        </div>
      </div>
    </div>
  );
};

export default TansoMain;
