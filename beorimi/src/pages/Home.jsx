import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage, getTodayStats } from "../api/resultData";

const YOUTUBE_VIDEOS = [
  { id: "lNMxKPDpWEw", title: "분리배출 이렇게 하세요! 한눈에 보는 분리수거 방법" },
  { id: "RwCEYGcMkSw", title: "재활용 쓰레기, 제대로 버리는 법" },
  { id: "Gl1tZ5wiEvg", title: "올바른 분리배출 가이드 (환경부)" },
  { id: "GKFDEEQMYmc", title: "음식물 쓰레기 올바른 배출 방법" },
];

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [todayCount, setTodayCount] = useState(0);
  const [recentItem, setRecentItem] = useState("없음");
  const [statsMessage, setStatsMessage] = useState("오늘도 분리배출을 시작해볼까요? 🌱");
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("news");

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getTodayStats();
        setTodayCount(data.today_count || 0);
        setRecentItem(data.recent_item || "없음");
        if ((data.today_count || 0) > 0) {
          setStatsMessage("오늘도 지구를 위한 실천을 이어가고 있어요 🌿");
        } else {
          setStatsMessage("오늘도 분리배출을 시작해볼까요? 🌱");
        }
      } catch {
        setStatsMessage("오늘도 분리배출을 시작해볼까요? 🌱");
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    const rssUrl = encodeURIComponent(
      "https://news.google.com/rss/search?q=분리수거+재활용&hl=ko&gl=KR&ceid=KR:ko"
    );
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}&count=6`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "ok") setNews(data.items.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setNewsLoading(false));
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        localStorage.setItem("uploadedImage", reader.result);
        localStorage.removeItem("capturedImage");
        await uploadImage(file);
        navigate("/result");
      } catch {
        alert("이미지 업로드에 실패했습니다.");
      }
    };
    reader.readAsDataURL(file);
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
              <p className="stats-value"><span>{todayCount}</span>회</p>
            </div>
            <div className="stats-item">
              <p className="stats-label">최근 배출 품목</p>
              <p className="stats-value small">{recentItem}</p>
            </div>
          </div>
          <p className="stats-message">{statsMessage}</p>
        </div>
      </section>

      <div className="buttons">
        <button type="button" onClick={() => navigate("/camera")}>카메라</button>
        <button type="button" id="uploadBtn" onClick={() => fileInputRef.current?.click()}>업로드</button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {/* 뉴스 / 영상 섹션 */}
      <section className="media-section">
        <div className="media-tabs">
          <button
            className={activeTab === "news" ? "active" : ""}
            onClick={() => setActiveTab("news")}
          >
            📰 뉴스
          </button>
          <button
            className={activeTab === "youtube" ? "active" : ""}
            onClick={() => setActiveTab("youtube")}
          >
            ▶ 영상
          </button>
        </div>

        {activeTab === "news" && (
          <div className="media-content">
            {newsLoading ? (
              <p className="media-loading">뉴스 불러오는 중...</p>
            ) : news.length > 0 ? (
              <div className="news-list">
                {news.map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-card"
                  >
                    <p className="news-headline">{item.title}</p>
                    <span className="news-meta">
                      {item.author || "뉴스"} ·{" "}
                      {new Date(item.pubDate).toLocaleDateString("ko-KR")}
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="media-empty">뉴스를 불러올 수 없습니다.</p>
            )}
          </div>
        )}

        {activeTab === "youtube" && (
          <div className="media-content">
            <div className="youtube-list">
              {YOUTUBE_VIDEOS.map((video, i) => (
                <div key={i} className="youtube-embed-card">
                  <div className="youtube-iframe-wrap">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="youtube-embed-title">{video.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
