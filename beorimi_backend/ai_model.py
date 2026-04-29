import json
from transformers import pipeline, AutoImageProcessor
from PIL import Image

# 백엔드 서버에 모델 폴더를 업로드한 실제 경로로 수정 필요
MODEL_PATH = "./my_permanent_model" 
THRESHOLD = 0.6

KOR_TO_ENG = {
    "종이": "paper", "종이팩": "paper_carton", "종이컵": "paper_cup",
    "캔": "can", "유리": "glass", "페트": "pet", "플라스틱": "plastic",
    "비닐": "vinyl", "스티로폼": "styrofoam", "건전지": "battery",
    "residue": "residue"
}

# 서버가 켜질 때 모델을 메모리에 딱 한 번만 올리도록 전역으로 설정
print("Loading AI Model...")
image_processor = AutoImageProcessor.from_pretrained("microsoft/swin-tiny-patch4-window7-224")
classifier = pipeline(
    "image-classification",
    model=MODEL_PATH,
    image_processor=image_processor
)
print("AI Model Loaded Successfully!")

def analyze_waste_image(image_input):
    """
    프론트엔드에서 받은 이미지를 분석하여 JSON 형태의 딕셔너리로 반환하는 함수
    """
    predictions = classifier(image_input, top_k=None)
    detected = []

    for pred in predictions:
        if pred['score'] > THRESHOLD:
            kor_label = pred['label']
            if kor_label in KOR_TO_ENG:
                detected.append(KOR_TO_ENG[kor_label])

    detected = list(set(detected))

    result_dict = {
        "detected_waste": [{"class_name": item} for item in detected if item != "residue"],
        "is_dirty": "residue" in detected
    }
    
    return result_dict