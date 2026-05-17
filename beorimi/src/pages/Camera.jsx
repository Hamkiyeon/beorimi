import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../api/resultData";

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("카메라 실행 오류:", error);
        alert("카메라를 실행할 수 없습니다.");
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext("2d");

    const maxWidth = 800;
    const scale = Math.min(1, maxWidth / video.videoWidth);

    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg", 0.7);

    try {
      localStorage.setItem("capturedImage", imageData);
      localStorage.removeItem("uploadedImage");

      const blob = await (await fetch(imageData)).blob();
      const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });

      await uploadImage(file);

      navigate("/result");
    } catch (error) {
      console.error("촬영 이미지 업로드 오류:", error);
      alert("촬영 이미지 업로드에 실패했습니다.");
    }
  };

  return (
    <main>
      <section className="camera-page">
        <div className="camera-guide">
          <p>📷 쓰레기를 화면 중앙에 맞춰 촬영하세요</p>
          <p>빛이 충분한 곳에서 촬영하면 정확도가 높아집니다</p>
        </div>

        <div className="camera-box">
          <video ref={videoRef} autoPlay playsInline />
        </div>

        <button id="captureBtn" type="button" onClick={handleCapture}>
          촬영
        </button>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </section>
    </main>
  );
}