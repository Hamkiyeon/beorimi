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

    print(f"[upload-image] upload_id={upload_id}, saved_path={file_path}")

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

    print("[analyze] called")
    print("[analyze] LAST_UPLOADED_IMAGE =", LAST_UPLOADED_IMAGE)
    print("[analyze] LAST_UPLOAD_ID =", LAST_UPLOAD_ID)

    if not LAST_UPLOADED_IMAGE:
        raise HTTPException(status_code=400, detail="먼저 이미지를 업로드해주세요.")

    if not os.path.exists(LAST_UPLOADED_IMAGE):
        raise HTTPException(status_code=404, detail="업로드된 이미지 파일을 찾을 수 없습니다.")

    try:
        ai_result = analyze_waste_image(LAST_UPLOADED_IMAGE)
        print("[analyze] ai_result =", ai_result)

        detected_waste = ai_result.get("detected_waste", [])
        is_dirty = ai_result.get("is_dirty", False)

        results = []
        unknown_items = []

        for item in detected_waste:
            class_name = item.get("class_name")
            print("[analyze] class_name =", class_name)

            if not class_name:
                continue

            # 1) 가이드 조회
            try:
                guide = get_recycling_info(class_name, is_dirty)
                print("[analyze] guide =", guide)
            except Exception as guide_error:
                print("[analyze] get_recycling_info error =", repr(guide_error))
                traceback.print_exc()
                guide = None

            if guide is None:
                unknown_items.append(class_name)
            else:
                results.append(guide)

            # 2) 통계 저장
            try:
                existing = (
                    supabase
                    .table("detections")
                    .select("id")
                    .eq("upload_id", LAST_UPLOAD_ID)
                    .eq("class_name", class_name)
                    .execute()
                )
                print("[analyze] existing =", existing.data)

                if not existing.data:
                    insert_result = (
                        supabase
                        .table("detections")
                        .insert({
                            "upload_id": LAST_UPLOAD_ID,
                            "class_name": class_name
                        })
                        .execute()
                    )
                    print("[analyze] insert_result =", insert_result.data)

            except Exception as insert_error:
                print("[analyze] detections 저장 오류 무시 =", repr(insert_error))
                traceback.print_exc()

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
    today = datetime.now().date()
    start_of_day = datetime.combine(today, datetime.min.time()).isoformat()

    response = (
        supabase
        .table("detections")
        .select("*")
        .gte("created_at", start_of_day)
        .execute()
    )

    data = response.data if response.data else []

    today_count = len(data)
    recent_item = "없음"

    if today_count > 0:
        recent_item = data[-1]["class_name"]

    return {
        "today_count": today_count,
        "recent_item": recent_item
    }