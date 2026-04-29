import React, { useState } from "react";

export default function Disposal() {
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);

  const districtData = {
    gyeonggi: [
      { value: "suwon-paldal", label: "수원시 팔달구" },
      { value: "suwon-gwonseon", label: "수원시 권선구" },
      { value: "suwon-yeongtong", label: "수원시 영통구" },
      { value: "suwon-jangan", label: "수원시 장안구" },
    ],
    chungbuk: [
      { value: "cheongju", label: "청주시" },
      { value: "chungju", label: "충주시" },
    ],
  };

  const disposalInfo = {
    "suwon-paldal": "수원시 팔달구 폐기물 처리 정보 예시입니다.",
    "suwon-gwonseon": "수원시 권선구 폐기물 처리 정보 예시입니다.",
    "suwon-yeongtong": "수원시 영통구 폐기물 처리 정보 예시입니다.",
    "suwon-jangan": "수원시 장안구 폐기물 처리 정보 예시입니다.",
    cheongju: "청주시 폐기물 처리 정보 예시입니다.",
    chungju: "충주시 폐기물 처리 정보 예시입니다.",
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);
    setDistrict("");
    setDistrictOptions(districtData[selectedProvince] || []);
  };

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
  };

  return (
    <main>
      <div className="disposal-wrap">
        <div className="disposal-top">
          <h2>폐기물 처리 정보</h2>
          <p>지역을 선택해주세요.</p>
        </div>

        <div className="select-row">
          <div className="select-box">
            <label htmlFor="provinceSelect">시 / 도 선택</label>
            <select
              id="provinceSelect"
              value={province}
              onChange={handleProvinceChange}
            >
              <option value="">선택해주세요</option>
              <option value="gyeonggi">경기도</option>
              <option value="chungbuk">충청북도</option>
            </select>
          </div>

          <div className="select-box">
            <label htmlFor="districtSelect">시 / 군 / 구 선택</label>
            <select
              id="districtSelect"
              value={district}
              onChange={handleDistrictChange}
            >
              <option value="">먼저 시 / 도를 선택해주세요</option>
              {districtOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div id="disposalContent">
          {district ? (
            <div className="disposal-card">{disposalInfo[district]}</div>
          ) : (
            <div className="disposal-card empty">
              지역을 선택하면 폐기물 처리 정보를 확인할 수 있어요.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}