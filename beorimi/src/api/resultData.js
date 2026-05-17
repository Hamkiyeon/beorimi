const BASE_URL = "http://127.0.0.1:8000";

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/upload-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "이미지 업로드 중 오류가 발생했습니다.");
  }

  return response.json();
}

export async function analyzeWaste(detectedWaste, isDirty = false) {
  const response = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      detected_waste: detectedWaste,
      is_dirty: isDirty,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "분석 요청 중 오류가 발생했습니다.");
  }

  return response.json();
}

export async function getResultData(isDirty = false) {
  const mockAiResult = {
    detected_waste: [
      { class_name: "plastic" },
      { class_name: "glass" },
    ],
    is_dirty: isDirty,
  };

  return analyzeWaste(mockAiResult.detected_waste, mockAiResult.is_dirty);
}

export async function getTodayStats() {
  const response = await fetch(`${BASE_URL}/stats/today`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "통계 조회 중 오류가 발생했습니다.");
  }

  return response.json();
}