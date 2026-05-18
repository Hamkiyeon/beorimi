"""
모델 파일을 HuggingFace Model Hub에 업로드 (Space가 아닌 별도 Model 저장소)
실행: py upload_model_to_hub.py
"""
from huggingface_hub import HfApi

HF_TOKEN   = "hf_여기에_토큰_붙여넣기"
MODEL_DIR  = "./my_permanent_model"
REPO_ID    = "luculentus/beorimi-waste-classifier"

api = HfApi()

# 저장소 생성 (이미 있으면 무시됨)
try:
    api.create_repo(repo_id=REPO_ID, repo_type="model", token=HF_TOKEN, exist_ok=True)
    print(f"저장소 준비 완료: {REPO_ID}")
except Exception as e:
    print(f"저장소 생성 오류 (이미 존재할 수 있음): {e}")

# 모델 폴더 전체 업로드
print(f"모델 파일 업로드 중... ({MODEL_DIR} → {REPO_ID})")
api.upload_folder(
    folder_path=MODEL_DIR,
    repo_id=REPO_ID,
    repo_type="model",
    token=HF_TOKEN,
)
print(f"완료! https://huggingface.co/{REPO_ID}")
