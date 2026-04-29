import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResultData } from "../api/resultData";

export default function Result() {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState("");
  const [resultList, setResultList] = useState([]);
  const [unknownItems, setUnknownItems] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const capturedImage = localStorage.getItem("capturedImage");
    const uploadedImage = localStorage.getItem("uploadedImage");

    if (capturedImage) {
      setImageSrc(capturedImage);
    } else if (uploadedImage) {
      setImageSrc(uploadedImage);
    }

    async function fetchResult() {
      try {
        const data = await getResultData();

        setResultList(data.results || []);
        setUnknownItems(data.unknown_items || []);
        setIsDirty(data.is_dirty || false);
        setIsError(false);
      } catch (error) {
        console.error("결과 불러오기 실패:", error);
        setResultList([]);
        setUnknownItems([]);
        setIsDirty(false);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResult();
  }, []);

  return (
    <main>
      <section className="result-page">
        <div className="result-image-wrap">
          {imageSrc ? (
            <img src={imageSrc} alt="업로드한 이미지" />
          ) : (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                background: "#f5f5f5",
              }}
            >
              이미지가 없습니다.
            </div>
          )}
        </div>

        {isLoading ? (
          <div
            className="loading-box"
            style={{ padding: "40px 0", textAlign: "center" }}
          >
            <div className="spinner"></div>
            <p
              style={{
                marginTop: "15px",
                color: "#45a049",
                fontWeight: "bold",
              }}
            >
              AI가 이미지를 분석 중입니다... 🤖🔍
            </p>
          </div>
        ) : isError ? (
          <div
            className="error-box"
            style={{
              padding: "20px",
              borderRadius: "8px",
              background: "#ffebee",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#c62828", margin: 0, fontWeight: "bold" }}>
              분석 결과를 불러오지 못했습니다.
            </p>
            <p style={{ color: "#c62828", marginTop: "8px" }}>
              잠시 후 다시 시도해 주세요.
            </p>
          </div>
        ) : (
          <div className="result-box">
            {resultList.length > 0 && (
              <div
                className="dirty-check-box"
                style={{
                  padding: "15px",
                  borderRadius: "8px",
                  background: isDirty ? "#ffebee" : "#e8f5e9",
                }}
              >
                {isDirty ? (
                  <p style={{ color: "#c62828", margin: 0 }}>
                    ⚠️ <strong>오염물질 감지됨!</strong>
                    <br />
                    내용물을 비우고 물로 헹군 뒤 분리배출해 주세요.
                  </p>
                ) : (
                  <p style={{ color: "#2e7d32", margin: 0 }}>
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
                  <div className="card-header">
                    <span className="card-name">{item.korean_name}</span>
                    <span className="card-bin">{item.bin_color}</span>
                  </div>

                  <ul className="card-steps">
                    {item.disposal_steps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ul>

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

        <div
          className="result-btns"
          style={{ display: "flex", gap: "10px", marginTop: "20px" }}
        >
          <button
            type="button"
            onClick={() => navigate("/camera")}
            style={{
              flex: 1,
              padding: "12px",
              background: "#ccc",
              borderRadius: "8px",
            }}
            disabled={isLoading}
          >
            다시 촬영
          </button>
          <button
            type="button"
            className="home-btn"
            onClick={() => navigate("/")}
            style={{
              flex: 1,
              padding: "12px",
              background: isLoading ? "#9e9e9e" : "#45a049",
              color: "white",
              borderRadius: "8px",
            }}
            disabled={isLoading}
          >
            홈으로
          </button>
        </div>
      </section>
    </main>
  );
}