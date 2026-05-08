import { supabase } from "./supabase.js";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

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

export async function getResultData() {
  // 1. 백엔드에서 AI 분류 결과 가져오기
  const response = await fetch(`${BASE_URL}/analyze`, { method: "POST" });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "분석 요청 중 오류가 발생했습니다.");
  }

  const aiResult = await response.json();
  const detectedWaste = aiResult.detected_waste || [];
  const isDirty = aiResult.is_dirty || false;

  const classNames = detectedWaste
    .map((item) => item.class_name)
    .filter(Boolean);

  if (classNames.length === 0) {
    return { results: [], unknown_items: [], is_dirty: isDirty };
  }

  // 2. Supabase에서 가이드 데이터 조회
  const { data: guideRows, error } = await supabase
    .from("guide_rules")
    .select("class_name, title, guide_text")
    .in("class_name", classNames);

  if (error) {
    console.error("Supabase 에러:", error);
    throw new Error("가이드 정보를 불러오지 못했습니다.");
  }

  // 3. 결과 조합
  const guideMap = Object.fromEntries(guideRows.map((r) => [r.class_name, r]));

  const results = [];
  const unknownItems = [];

  for (const className of classNames) {
    const guide = guideMap[className];
    if (!guide) {
      unknownItems.push(className);
    } else {
      results.push({
        class_name: className,
        korean_name: guide.title,
        bin_color: "분리수거함 확인 필요",
        disposal_steps: [guide.guide_text],
        notes: guide.guide_text,
        dirty_warning: isDirty
          ? "오염된 경우 세척 후 배출하거나 일반쓰레기로 처리해야 할 수 있습니다."
          : null,
      });
    }
  }

  return { results, unknown_items: unknownItems, is_dirty: isDirty };
}
