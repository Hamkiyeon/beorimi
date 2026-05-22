import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResultData, uploadImage } from "../api/resultData";

const CATEGORY_ICONS = {
  paper: "📄",
  paper_pack: "🧃",
  paper_cup: "☕",
  can: "🥫",
  glass: "🫙",
  pet: "🍶",
  plastic: "🧴",
  vinyl: "🛍️",
  styrofoam: "📦",
  battery: "🔋",
};

export default function Result() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState("");
  const [resultList, setResultList] = useState([]);
  const [unknownItems, setUnknownItems] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const hasFetched = useRef(false);

  const fetchResult = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await getResultData();
      setResultList(data.results || []);
      setUnknownItems(data.unknown_items || []);
      setIsDirty(data.is_dirty || false);
    } catch (error) {
      console.error("결과 불러오기 실패:", error);
      setResultList([]);
      setUnknownItems([]);
      setIsDirty(false);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const capturedImage = localStorage.getItem("capturedImage");
    const uploadedImage = localStorage.getItem("uploadedImage");

    if (capturedImage) {
      setImageSrc(capturedImage);
    } else if (uploadedImage) {
      setImageSrc(uploadedImage);
    }

    fetchResult();
  }, [fetchResult]);

  const handleReUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        localStorage.setItem("uploadedImage", reader.result);
        localStorage.removeItem("capturedImage");
        setImageSrc(reader.result);
        await uploadImage(file);
        await fetchResult();
      } catch (error) {
        console.error("재업로드 실패:", error);
        alert("이미지 업로드에 실패했습니다.");
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <main>
      <section className="result-page">
        <div className="result-image-wrap">
          {imageSrc ? (
            <img src={imageSrc} alt="업로드한 이미지" />
          ) : (
            <div className="no-image-placeholder">이미지가 없습니다.</div>
          )}
        </div>

        {isLoading ? (
          <div className="loading-box">
            <div className="spinner"></div>
            <p className="loading-text">AI가 이미지를 분석 중입니다... 🤖🔍</p>
          </div>
        ) : isError ? (
          <div className="error-box">
            <p className="error-title">분석 결과를 불러오지 못했습니다.</p>
            <p className="error-sub">잠시 후 다시 시도해 주세요.</p>
          </div>
        ) : (
          <div className="result-box">
            {resultList.length > 0 && (
              <div className={`dirty-check-box${isDirty ? " dirty" : " clean"}`}>
                {isDirty ? (
                  <p>
                    ⚠️ <strong>오염물질 감지됨!</strong>
                    <br />
                    내용물을 비우고 물로 헹군 뒤 분리배출해 주세요.
                  </p>
                ) : (
                  <p>
                    ✅ <strong>분석 결과가 도착했습니다!</strong>
                    <br />
                    아래 품목별 안내를 확인해 주세요.
                  </p>
                )}
              </div>
            )}

            {resultList.length > 0 ? (
              resultList.map((item, index) => (
                <div key={index} className="result-card">
                  <div className="card-visual-header">
                    <span className="card-icon">
                      {item.icon || CATEGORY_ICONS[item.class_name] || "♻️"}
                    </span>
                    <div className="card-title-group">
                      <span className="card-name">{item.korean_name}</span>
                      <span className="card-bin">{item.bin_color}</span>
                    </div>
                  </div>

                  <div className="card-guide-section">
                    <p className="card-guide-title">분리배출 방법</p>
                    <ol className="card-steps">
                      {item.disposal_steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="card-step-item">
                          <span className="step-number">{stepIndex + 1}</span>
                          <span className="step-text">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {item.notes && <p className="card-notes">{item.notes}</p>}
                  {item.dirty_warning && (
                    <p className="card-warning">{item.dirty_warning}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="empty-text">분석 결과가 없습니다.</p>
            )}

            {unknownItems.length > 0 && (
              <div className="unknown-box">
                <strong>인식 불가 항목:</strong> {unknownItems.join(", ")}
                <p>해당 항목은 아직 지원되지 않거나 일반쓰레기로 배출해주세요.</p>
              </div>
            )}
          </div>
        )}

        <div className="result-btns">
          <button
            type="button"
            className="btn-retake"
            onClick={() => navigate("/camera")}
            disabled={isLoading}
          >
            📷 다시 촬영
          </button>
          <button
            type="button"
            className="btn-reupload"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            📁 재업로드
          </button>
          <button
            type="button"
            className="btn-home"
            onClick={() => navigate("/")}
            disabled={isLoading}
          >
            홈으로
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleReUpload}
          style={{ display: "none" }}
        />
      </section>
    </main>
  );
}
