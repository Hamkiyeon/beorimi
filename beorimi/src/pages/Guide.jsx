import React, { useState } from "react";

export default function Guide() {
  const [activeTab, setActiveTab] = useState("pet");

  const tabContent = {
    pet: (
      <div className="guide-card">
        <h2>페트</h2>
        <p className="guide-subtitle">투명 페트병은 따로 배출해요</p>
        <ul>
          <li>내용물을 비우고 물로 헹궈주세요.</li>
          <li>라벨을 제거해주세요.</li>
          <li>찌그러뜨린 뒤 뚜껑을 닫아 배출하세요.</li>
          <li>투명 페트병은 별도 분리배출합니다.</li>
        </ul>
      </div>
    ),
    plastic: (
      <div className="guide-card">
        <h2>플라스틱</h2>
        <p>이물질을 제거한 뒤 분리배출하세요.</p>
      </div>
    ),
    vinyl: (
      <div className="guide-card">
        <h2>비닐</h2>
        <p>깨끗한 비닐만 분리배출하고, 오염된 비닐은 일반쓰레기로 배출하세요.</p>
      </div>
    ),
    foam: (
      <div className="guide-card">
        <h2>스티로폼</h2>
        <p>테이프와 이물질을 제거한 후 배출하세요.</p>
      </div>
    ),
    can: (
      <div className="guide-card">
        <h2>캔/유리</h2>
        <p>내용물을 비우고 헹군 뒤 분리배출하세요.</p>
      </div>
    ),
    etc: (
      <div className="guide-card">
        <h2>기타</h2>
        <p>품목별 배출 기준을 확인한 뒤 올바르게 배출하세요.</p>
      </div>
    ),
  };

  return (
    <main>
      <div className="guide-wrap">
        <div className="tab-buttons">
          <button
            type="button"
            onClick={() => setActiveTab("pet")}
            className={activeTab === "pet" ? "active" : ""}
          >
            페트
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("plastic")}
            className={activeTab === "plastic" ? "active" : ""}
          >
            플라스틱
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("vinyl")}
            className={activeTab === "vinyl" ? "active" : ""}
          >
            비닐
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("foam")}
            className={activeTab === "foam" ? "active" : ""}
          >
            스티로폼
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("can")}
            className={activeTab === "can" ? "active" : ""}
          >
            캔/유리
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("etc")}
            className={activeTab === "etc" ? "active" : ""}
          >
            기타
          </button>
        </div>

        <div id="content">{tabContent[activeTab]}</div>
      </div>
    </main>
  );
}