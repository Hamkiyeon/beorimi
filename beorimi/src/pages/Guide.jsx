import React, { useState } from "react";

const tabs = [
  { key: "pet", label: "페트" },
  { key: "plastic", label: "플라스틱" },
  { key: "vinyl", label: "비닐" },
  { key: "foam", label: "스티로폼" },
  { key: "can", label: "캔" },
  { key: "glass", label: "유리" },
  { key: "paper", label: "종이" },
  { key: "carton", label: "종이팩" },
  { key: "etc", label: "기타" },
];

const tabData = {
  pet: {
    title: "페트 (PET)",
    subtitle: "투명 페트병은 별도 수거함에 따로 배출",
    steps: [
      "내용물을 완전히 비워주세요",
      "물로 깨끗이 헹궈주세요",
      "라벨을 완전히 제거해주세요",
      "찌그러뜨린 후 뚜껑을 닫아 배출하세요",
    ],
    ok: [
      "생수병 (투명)",
      "음료수 페트병 (투명)",
      "투명 페트 용기류",
    ],
    ng: [
      "유색 페트병 → 플라스틱 수거함으로",
      "식용유 페트병 → 플라스틱 수거함으로",
      "세척 불가한 페트병 → 일반쓰레기",
      "마요네즈·케첩 페트 용기 → 플라스틱 수거함으로",
    ],
    tip: "아파트 단지는 투명 페트병 전용 수거함이 별도로 있어요. 일반 플라스틱 수거함에 넣지 마세요.",
  },
  plastic: {
    title: "플라스틱",
    subtitle: "용기 바닥의 재질 표시를 확인하세요",
    steps: [
      "내용물을 완전히 비워주세요",
      "물로 깨끗이 헹궈주세요",
      "라벨·스티커·이물질을 제거해주세요",
      "가능하면 압착한 후 배출하세요",
    ],
    ok: [
      "세제통, 샴푸통, 린스통",
      "요구르트 용기, 플라스틱 컵",
      "유색 페트병, 식용유 페트병",
      "PP·PE·PS·PVC 표시 용기",
      "장난감 (단일 재질)",
    ],
    ng: [
      "칫솔·면도기 (복합재질) → 일반쓰레기",
      "이물질 세척 불가 용기 → 일반쓰레기",
      "심하게 훼손·변형된 것 → 일반쓰레기",
      "재질 표시 없는 플라스틱 → 일반쓰레기",
      "열에 녹은 플라스틱 → 일반쓰레기",
    ],
    tip: "용기 바닥의 삼각형 재질 마크(PP, PE, PS 등)를 확인하세요. 마크가 없으면 일반쓰레기입니다.",
  },
  vinyl: {
    title: "비닐",
    subtitle: "종류·색상 무관하게 분리배출 가능",
    steps: [
      "내용물을 완전히 비워주세요",
      "이물질을 제거해주세요 (물세척)",
      "여러 장을 모아 하나로 묶거나 봉투에 담아 배출하세요",
    ],
    ok: [
      "과자봉지, 라면봉지",
      "쇼핑백, 비닐봉투 (색상 무관)",
      "지퍼백, 위생비닐",
      "에어캡 (뽁뽁이)",
      "세탁소 비닐",
      "김 포장 비닐",
    ],
    ng: [
      "랩 필름 → 일반쓰레기",
      "테이프류 → 일반쓰레기",
      "은박 보온봉투 → 일반쓰레기",
      "부직포 재질 → 일반쓰레기",
      "이물질 제거 불가 비닐 → 일반쓰레기",
    ],
    tip: "이물질 제거가 어려운 경우에는 종량제 봉투에 배출하세요.",
  },
  foam: {
    title: "스티로폼",
    subtitle: "흰색 스티로폼만 재활용 가능",
    steps: [
      "내용물과 이물질을 모두 제거해주세요",
      "물로 깨끗이 세척해주세요",
      "테이프·스티커 등 부착물을 제거해주세요",
      "별도 스티로폼 수거함에 배출하세요",
    ],
    ok: [
      "흰색 스티로폼 박스",
      "흰색 완충재",
      "흰색 컵라면 용기 (세척 후)",
    ],
    ng: [
      "색상 있는 스티로폼 → 일반쓰레기",
      "비닐 코팅된 스티로폼 → 일반쓰레기",
      "과일 개별 포장 스티로폼망 → 일반쓰레기",
      "불순물·이물질 포함 → 일반쓰레기",
      "색상 인쇄가 많은 스티로폼 → 일반쓰레기",
    ],
    tip: "흰색이어도 비닐 코팅, 색상 인쇄가 많거나 이물질이 제거되지 않으면 일반쓰레기입니다.",
  },
  can: {
    title: "캔",
    subtitle: "알루미늄캔과 철캔을 구분해서 배출",
    steps: [
      "내용물을 완전히 비워주세요",
      "물로 깨끗이 헹궈주세요",
      "플라스틱 뚜껑 등 다른 재질을 분리해주세요",
      "찌그러뜨려 배출하세요",
    ],
    ok: [
      "음료캔 (알루미늄·철)",
      "통조림캔",
      "분유통, 과자통 (철캔)",
      "페인트통 (잔량 없는 것)",
      "부탄가스통 (구멍 뚫은 것)",
    ],
    ng: [
      "내용물 잔량 있는 것 → 비운 후 재배출",
      "기름때 세척 불가 → 일반쓰레기",
      "복합재질 혼합 (분리 불가) → 일반쓰레기",
    ],
    tip: "부탄가스통은 반드시 구멍을 뚫어 내용물을 완전히 비운 후 배출하세요. 내용물이 남은 채 압착하면 화재 위험이 있습니다.",
  },
  glass: {
    title: "유리",
    subtitle: "유리 전용 수거함에 별도 배출",
    steps: [
      "내용물을 완전히 비워주세요",
      "물로 깨끗이 헹궈주세요",
      "뚜껑과 라벨을 제거해주세요",
      "유리 전용 수거함에 배출하세요",
    ],
    ok: [
      "음료병, 소주병, 맥주병",
      "잼병, 드레싱병",
      "음식 보관 유리 용기",
    ],
    ng: [
      "깨진 유리 → 신문지 감싸 일반쓰레기",
      "도자기·사기그릇 → 일반쓰레기",
      "거울·창문 유리 → 일반쓰레기",
      "형광등 → 형광등 전용 수거함",
      "내열유리 (파이렉스 등) → 일반쓰레기",
      "크리스탈 유리 → 일반쓰레기",
    ],
    tip: "깨진 유리는 찔릴 위험이 있으니 신문지에 싸서 '유리 위험' 표시 후 일반쓰레기로 배출하세요.",
  },
  paper: {
    title: "종이",
    subtitle: "코팅·오염 없는 종이만 재활용 가능",
    steps: [
      "비닐·테이프·스티커 등 이물질을 제거해주세요",
      "종류별로 분류해주세요 (신문지, 책, 박스 등)",
      "끈으로 묶거나 박스에 담아 배출하세요",
      "박스류는 접어서 부피를 줄여 배출하세요",
    ],
    ok: [
      "신문지, 광고지",
      "책·잡지",
      "종이박스 (테이프·스티커 제거 후)",
      "복사지, 노트, 공책",
      "종이쇼핑백 (손잡이 끈 제거 후)",
    ],
    ng: [
      "영수증·감열지 → 일반쓰레기",
      "은박지·코팅 종이 → 일반쓰레기",
      "방수 코팅 종이 → 일반쓰레기",
      "기름·음식 오염된 종이 → 일반쓰레기",
      "사진·필름 → 일반쓰레기",
      "종이컵 → 종이컵 전용 수거함",
      "우유팩·음료팩 → 종이팩 전용 수거함",
    ],
    tip: "종이박스는 물기에 닿으면 재활용이 어려워요. 비 오는 날에는 실내에 보관했다가 맑은 날 배출하세요.",
  },
  carton: {
    title: "종이팩",
    subtitle: "일반 종이와 섞지 말고 별도 배출",
    steps: [
      "내용물을 완전히 비워주세요",
      "물로 깨끗이 헹궈주세요",
      "가위로 잘라 펼쳐 건조시켜주세요",
      "종이팩 전용 수거함 또는 끈으로 묶어 배출하세요",
    ],
    ok: [
      "우유팩 (흰색)",
      "두유팩",
      "주스팩",
      "음료 종이팩 (멸균팩 포함)",
    ],
    ng: [
      "종이컵 → 종이컵 전용 수거함 (별도)",
      "오염된 팩 → 일반쓰레기",
      "내용물 잔여 팩 → 세척 후 재배출",
    ],
    tip: "종이팩은 일반 종이와 섞이면 재활용되지 않아요. 반드시 종이팩 전용 수거함에 별도로 배출하세요.",
  },
  etc: {
    title: "기타 분리배출",
    subtitle: "전용 수거함이 별도로 필요한 품목들",
    specialItems: [
      {
        label: "건전지",
        where: "마트, 편의점, 주민센터 내 건전지 전용 수거함",
        note: "일반·충전식 건전지 모두 해당",
      },
      {
        label: "형광등",
        where: "주민센터, 아파트 경비실 형광등 전용 수거함",
        note: "깨진 경우 신문지에 싸서 전용 수거함 이용",
      },
      {
        label: "소형가전",
        where: "동 주민센터, 구청 소형가전 전용 수거함",
        note: "휴대폰, 다리미, 믹서기, 헤어드라이어 등",
      },
      {
        label: "의류·신발",
        where: "아파트 의류 수거함, 재활용 의류 기증함",
        note: "헌옷, 이불, 신발류 포함",
      },
      {
        label: "폐의약품",
        where: "가까운 약국 전용 수거함",
        note: "유통기한 지난 약, 남은 처방약 모두 포함",
      },
      {
        label: "폐식용유",
        where: "주민센터, 환경교육센터 수거함",
        note: "식용유, 튀김유, 폐오일",
      },
    ],
  },
};

export default function Guide() {
  const [activeTab, setActiveTab] = useState("pet");
  const current = tabData[activeTab];

  return (
    <main>
      <div className="guide-wrap">
        <div className="tab-buttons">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={activeTab === tab.key ? "active" : ""}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="guide-card">
          <div className="guide-card-header">
            <h2>{current.title}</h2>
            <p className="guide-subtitle">{current.subtitle}</p>
          </div>

          <div className="guide-card-body">
            {current.steps && (
              <div className="guide-section">
                <p className="guide-section-title steps">배출 방법</p>
                <div className="guide-steps">
                  {current.steps.map((step, i) => (
                    <div key={i} className="step-item">
                      <span className="step-num">{i + 1}</span>
                      <span className="step-text">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {current.ok && (
              <div className="guide-section">
                <p className="guide-section-title ok">배출 가능</p>
                <ul className="guide-ok-list">
                  {current.ok.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {current.ng && (
              <div className="guide-section">
                <p className="guide-section-title ng">배출 불가</p>
                <ul className="guide-ng-list">
                  {current.ng.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {current.tip && (
              <div className="guide-tip-box">
                <span className="guide-tip-label">TIP</span> {current.tip}
              </div>
            )}

            {current.specialItems && (
              <div className="guide-special-items">
                {current.specialItems.map((item, i) => (
                  <div key={i} className="special-item">
                    <span className="special-badge">{item.label}</span>
                    <div className="special-item-info">
                      <p className="special-item-where">{item.where}</p>
                      {item.note && (
                        <p className="special-item-note">{item.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
