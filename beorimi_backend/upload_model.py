"""
HuggingFace Spaces에 모델 zip 파일을 업로드하는 스크립트
실행: python upload_model.py
"""
from huggingface_hub import HfApi

# ✏️ 여기에 본인 정보 입력
HF_TOKEN   = "hf_여기에_토큰_붙여넣기"   # huggingface.co/settings/tokens
SPACE_NAME = "luculentus/beorimi"
ZIP_PATH   = "./my_permanent_model.zip"

api = HfApi()

print(f"Uploading {ZIP_PATH} → {SPACE_NAME} ...")
api.upload_file(
    path_or_fileobj=ZIP_PATH,
    path_in_repo="my_permanent_model.zip",
    repo_id=SPACE_NAME,
    repo_type="space",
    token=HF_TOKEN,
)
print("업로드 완료! HF Spaces가 자동으로 재빌드됩니다.")
