from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
from datetime import datetime
import traceback

from ai_model import analyze_waste_image
from recycling_guide import get_recycling_info
from database import supabase

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

LAST_UPLOADED_IMAGE = None
LAST_UPLOAD_ID = None


@app.get("/")
def root():
    return {"message": "서버가 실행 중입니다."}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    global LAST_UPLOADED_IMAGE, LAST_UPLOAD_ID

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="이미지 파일만 업로드할 수 있습니다.")

    upload_id = uuid.uuid4().hex

    _, ext = os.path.splitext(file.filename)
    if not ext:
        ext = ".jpg"

    saved_filename = f"{upload_id}{ext}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)

    content = await file.read()
    with open(file_path, "wb") as buffer:
        buffer.write(content)

    LAST_UPLOADED_IMAGE = file_path
    LAST_UPLOAD_ID = upload_id


    return {
        "upload_id": upload_id,
        "original_filename": file.filename,
        "saved_filename": saved_filename,
        "saved_path": file_path,
        "content_type": file.content_type,
        "message": "이미지 업로드 및 저장 성공"
    }


@app.post("/analyze")
def analyze():
    global LAST_UPLOADED_IMAGE, LAST_UPLOAD_ID

    if not LAST_UPLOADED_IMAGE:
        raise HTTPException(status_code=400, detail="먼저 이미지를 업로드해주세요.")

    if not os.path.exists(LAST_UPLOADED_IMAGE):
        raise HTTPException(status_code=404, detail="업로드된 이미지 파일을 찾을 수 없습니다.")

    try:
        ai_result = analyze_waste_image(LAST_UPLOADED_IMAGE)
        detected_waste = ai_result.get("detected_waste", [])
        is_dirty = ai_result.get("is_dirty", False)

        results = []
        unknown_items = []

        for item in detected_waste:
            class_name = item.get("class_name")
            if not class_name:
                continue

            try:
                guide = get_recycling_info(class_name, is_dirty)
            except Exception:
                guide = None

            if guide is None:
                unknown_items.append(class_name)
            else:
                results.append(guide)

            try:
                existing = (
                    supabase.table("detections")
                    .select("id")
                    .eq("upload_id", LAST_UPLOAD_ID)
                    .eq("class_name", class_name)
                    .execute()
                )
                if not existing.data:
                    supabase.table("detections").insert({
                        "upload_id": LAST_UPLOAD_ID,
                        "class_name": class_name
                    }).execute()
            except Exception:
                pass

        response_data = {
            "results": results,
            "unknown_items": unknown_items,
            "is_dirty": is_dirty
        }

        print("[analyze] response_data =", response_data)
        return response_data

    except Exception as e:
        print("[analyze] fatal error =", repr(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI 분석 중 오류 발생: {str(e)}")


@app.get("/stats/today")
def get_today_stats():
    try:
        today = datetime.now().date()
        start_of_day = datetime.combine(today, datetime.min.time()).isoformat()

        response = (
            supabase.table("detections")
            .select("*")
            .gte("created_at", start_of_day)
            .execute()
        )

        data = response.data if response.data else []
        today_count = len(data)
        recent_item = data[-1]["class_name"] if today_count > 0 else "없음"
    except Exception:
        today_count = 0
        recent_item = "없음"

    return {
        "today_count": today_count,
        "recent_item": recent_item
    }