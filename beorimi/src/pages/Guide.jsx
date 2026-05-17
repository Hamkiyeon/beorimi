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
          <li>생수 및 음료 이외의 투명페트병, 페트용기류, 유색페트병은 플라스틱으로 배출해 주세요.</li>
        </ul>
      </div>
    ),
    plastic: (
      <div className="guide-card">
        <h2>플라스틱</h2>
        <p>내용물을 깨끗이 비우고 라벨지 또는 접착스티커 등을 제거한 후 가능한 압착 하여 배출합니다.</p>
        <p>이물질이 묻어있거나 심하게 훼손된 경우 재활용이 불가능하므로 일반쓰레기로 배출해 주세요.</p>
      </div>
    ),
    vinyl: (
      <div className="guide-card">
        <h2>비닐</h2>
        <p>비닐은 종류와 색상 관계없이 분리배출 대상입니다.</p>
        <p>단, 랩과 테이프는 일반 쓰레기입니다.</p>
        <p>내용물을 비우고 물로 헹구는 등 이물질을 제거 후 배출해 주세요.</p>
        <p>이물질 제거가 어려운 경우에는 종량제 봉투로 배출해 주세요.</p>
      </div>
    ),
    foam: (
      <div className="guide-card">
        <h2>스티로폼</h2>
        <p>내용물을 모두 비우고, 이물질은 물로 깨끗이 세척한 후 배출해 주세요.</p>
        <p>이물질이 완전히 제거 안되면 일반쓰레기입니다.</p>
        <p>무늬와 색상, 비닐 코팅된 경우와 과일 개별 포장에 쓰이는 스티로폼은 일반쓰레기로 버려주세요.</p>
      </div>
    ),
    can: (
      <div className="guide-card">
        <h2>캔/유리</h2>
        <p>플라스틱 뚜껑 등 다른 재질 부분은 제거해 주세요.</p>
        <p>내용물을 비우고 물로 헹군 후, 찌그러뜨립니다.</p>
        <p>부탄가스 등은 구멍을 뚫어 내용물을 비워주세요.</p>
        <p>같은 캔이라도 알루미늄과 철을 구분해서 배출해 주세요.</p>
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