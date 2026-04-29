import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../api/resultData";

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [todayCount, setTodayCount] = useState(0);
  const [recentItem, setRecentItem] = useState("없음");
  const [statsMessage, setStatsMessage] = useState("오늘도 분리배출을 시작해볼까요? 🌱");

  useEffect(() => {
    const savedCount = localStorage.getItem("todayCount");
    const savedItem = localStorage.getItem("recentItem");

    if (savedCount) {
      setTodayCount(Number(savedCount));
    }

    if (savedItem) {
      setRecentItem(savedItem);
    }

    if (savedCount && Number(savedCount) > 0) {
      setStatsMessage("오늘도 지구를 위한 실천을 이어가고 있어요 🌿");
    }
  }, []);

  const handleCameraClick = () => {
    navigate("/camera");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    // 미리보기용 localStorage 저장
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        localStorage.setItem("uploadedImage", reader.result);
        localStorage.removeItem("capturedImage");

        // 서버 uploads 폴더에 저장
        await uploadImage(file);

        navigate("/result");
      } catch (error) {
        console.error("이미지 업로드 중 오류 발생:", error);
        alert("이미지 업로드에 실패했습니다.");
      }
    };

    reader.readAsDataURL(file);
  } catch (error) {
    console.error("파일 처리 중 오류 발생:", error);
    alert("파일 처리에 실패했습니다.");
  }
};

  return (
    <main>
      <div className="about">
        <span>✨ AI 기반 분리배출 가이드</span>
        <h2>지구를 위한 작은 실천</h2>
        <p>
          쓰레기 사진을 찍으면
          <br />
          AI가 분리배출 방법을 알려드려요!
        </p>
      </div>

      <section className="stats-section">
        <h3>오늘의 분리배출 현황</h3>

        <div className="stats-card">
          <div className="stats-top">
            <div className="stats-item">
              <p className="stats-label">오늘 배출 횟수</p>
              <p className="stats-value">
                <span id="todayCount">{todayCount}</span>회
              </p>
            </div>

            <div className="stats-item">
              <p className="stats-label">최근 배출 품목</p>
              <p className="stats-value small" id="recentItem">
                {recentItem}
              </p>
            </div>
          </div>

          <p className="stats-message" id="statsMessage">
            {statsMessage}
          </p>
        </div>
      </section>

      <div className="buttons">
        <button type="button" onClick={handleCameraClick}>
          카메라
        </button>

        <button type="button" id="uploadBtn" onClick={handleUploadClick}>
          업로드
        </button>

        <input
          type="file"
          id="fileInput"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
    </main>
  );
}