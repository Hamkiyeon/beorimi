import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../api/resultData";

const YOUTUBE_VIDEOS = [
  { id: "o0CbvjoLd8U", title: "분리배출 이렇게 하세요! 한눈에 보는 분리수거 방법" },
  { id: "5vQlboNwC4s", title: "재활용 쓰레기, 제대로 버리는 법" },
  { id: "9m4gnPozJVM", title: "올바른 분리배출 가이드 (환경부)" },
];

const DAILY_MESSAGES = [
  "오늘 버린 쓰레기 하나가 지구를 바꿉니다 🌍",
  "분리배출은 가장 쉬운 환경 실천이에요 ♻️",
  "깨끗이 씻어서 버리면 재활용률이 높아져요 💧",
  "올바른 분리배출로 자원을 순환시켜요 🔄",
  "작은 실천이 모여 큰 변화를 만들어요 🌱",
  "재활용된 캔 하나가 TV를 3시간 켤 수 있어요 ⚡",
  "지구를 위한 오늘의 한 걸음, 분리배출! 🌿",
];

const TIPS = [
  { icon: "🍶", text: "페트병은 라벨을 떼고 납작하게 찌그러뜨려 투명페트 전용 수거함에 넣어주세요." },
  { icon: "🧴", text: "플라스틱 용기는 내용물을 비우고 라벨을 제거한 후 배출하세요." },
  { icon: "📄", text: "영수증·코팅지·오염된 종이는 일반쓰레기예요. 깨끗한 종이만 분리배출!" },
  { icon: "🥫", text: "캔은 내용물을 비우고 찌그러뜨려 부피를 줄여서 배출하세요." },
  { icon: "🛍️", text: "비닐은 색상 관계없이 모두 비닐 수거함에 배출 가능해요. 단, 테이프는 일반쓰레기!" },
  { icon: "🫙", text: "유리병은 뚜껑을 분리하고 내용물을 헹궈서 배출하세요." },
  { icon: "🧃", text: "종이팩은 내용물을 비우고 펼쳐 말린 후 전용 수거함에 넣어주세요." },
  { icon: "🔋", text: "건전지는 양극·음극을 테이프로 감싸 건전지 전용 수거함에 배출하세요." },
  { icon: "📦", text: "스티로폼은 이물질을 깨끗이 제거한 것만 재활용 가능해요." },
  { icon: "💡", text: "형광등은 깨지지 않게 조심히 다뤄 형광등 전용 수거함에 배출하세요." },
];

const ECO_FACTS = [
  { icon: "🍶", item: "페트병 1개", effect: "에너지 0.5kWh 절약" },
  { icon: "📄", item: "종이 1kg", effect: "나무 17그루 보호" },
  { icon: "🥫", item: "알루미늄 캔 1개", effect: "TV 3시간 전력 절약" },
  { icon: "🫙", item: "유리병 1개", effect: "전구 4시간 점등" },
  { icon: "🧴", item: "플라스틱 1kg", effect: "원유 1L 대체" },
];

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("news");

  const dayIndex = Math.floor(Date.now() / 86400000);
  const todayMessage = DAILY_MESSAGES[dayIndex % DAILY_MESSAGES.length];
  const todayTip = TIPS[dayIndex % TIPS.length];

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    fetch(`${BASE_URL}/news`)
      .then((r) => r.json())
      .then((data) => setNews(data.items || []))
      .catch(() => {})
      .finally(() => setNewsLoading(false));
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const img = new Image();
        img.src = reader.result;
        await new Promise((resolve) => { img.onload = resolve; });

        const canvas = document.createElement("canvas");
        const maxWidth = 800;
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL("image/jpeg", 0.7);

        localStorage.setItem("uploadedImage", compressed);
        localStorage.removeItem("capturedImage");

        const blob = await (await fetch(compressed)).blob();
        const uploadFile = new File([blob], file.name || "image.jpg", { type: "image/jpeg" });
        await uploadImage(uploadFile);
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

      {/* 환경 한줄 메시지 */}
      <div className="eco-message">
        <p>{todayMessage}</p>
      </div>

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

      {/* 오늘의 분리배출 팁 */}
      <section className="tip-section">
        <p className="tip-label">💡 오늘의 분리배출 팁</p>
        <div className="tip-card">
          <span className="tip-icon">{todayTip.icon}</span>
          <p className="tip-text">{todayTip.text}</p>
        </div>
      </section>

      {/* 자원 인포그래픽 */}
      <section className="eco-facts-section">
        <p className="eco-facts-label">♻️ 분리배출하면 아낄 수 있어요</p>
        <div className="eco-facts-scroll">
          {ECO_FACTS.map((fact, i) => (
            <div key={i} className="eco-fact-card">
              <span className="eco-fact-icon">{fact.icon}</span>
              <p className="eco-fact-item">{fact.item}</p>
              <p className="eco-fact-effect">{fact.effect}</p>
            </div>
          ))}
        </div>
      </section>

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
                      {item.source || "뉴스"}{item.pubDate ? " · " + new Date(item.pubDate).toLocaleDateString("ko-KR") : ""}
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
