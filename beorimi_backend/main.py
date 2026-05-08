from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid

from ai_model import analyze_waste_image

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


@app.get("/")
def root():
    return {"message": "서버가 실행 중입니다."}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    global LAST_UPLOADED_IMAGE

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="이미지 파일만 업로드할 수 있습니다.")

    _, ext = os.path.splitext(file.filename)
    if not ext:
        ext = ".jpg"

    saved_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)

    content = await file.read()
    with open(file_path, "wb") as buffer:
        buffer.write(content)

    LAST_UPLOADED_IMAGE = file_path

    return {
        "original_filename": file.filename,
        "saved_filename": saved_filename,
        "saved_path": file_path,
        "content_type": file.content_type,
        "message": "이미지 업로드 및 저장 성공"
    }


@app.post("/analyze")
def analyze():
    global LAST_UPLOADED_IMAGE

    if not LAST_UPLOADED_IMAGE:
        raise HTTPException(status_code=400, detail="먼저 이미지를 업로드해주세요.")

    if not os.path.exists(LAST_UPLOADED_IMAGE):
        raise HTTPException(status_code=404, detail="업로드된 이미지 파일을 찾을 수 없습니다.")

    try:
        ai_result = analyze_waste_image(LAST_UPLOADED_IMAGE)

        return {
            "detected_waste": ai_result.get("detected_waste", []),
            "is_dirty": ai_result.get("is_dirty", False),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI 분석 중 오류 발생: {str(e)}")