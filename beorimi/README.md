# 버리미 (Beorimi) - 프론트엔드

AI 기반 분리배출 가이드 웹 서비스 프론트엔드입니다.  
사용자가 이미지를 업로드하면, AI 분석 결과를 바탕으로 분리배출 방법을 안내합니다.

---

## 실행 방법

1. 패키지 설치
npm install

2. 개발 서버 실행
npm run dev

---

## 현재 상태

- 현재는 mock 데이터 기반으로 결과 화면을 확인할 수 있습니다.
- 실제 AI/백엔드 연동은 `src/api/resultData.js`에서 진행 예정입니다.

---

## 주요 구조

src/
 ├─ pages/         # 페이지 컴포넌트 (Home, Camera, Result 등)
 ├─ api/           # API 호출 함수 (현재 mock → 추후 서버 연결)
 ├─ mock/          # 임시 데이터 (AI 응답 mock)
 └─ ...

---

## 참고

- 결과 데이터 형식은 다음과 같이 가정하고 구현되어 있습니다:

{
  "detected_waste": [
    { "class_name": "plastic" }
  ],
  "is_dirty": false
}

- API 연결 시 위 형식에 맞춰주시면 됩니다.