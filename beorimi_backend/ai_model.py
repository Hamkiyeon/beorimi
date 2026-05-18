import torch
from transformers import AutoImageProcessor, SwinForImageClassification
from PIL import Image

MODEL_PATH = "./my_permanent_model"
THRESHOLD = 0.5

# 새 모델 config.json id2label (30 클래스)
ID_TO_LABEL = {
    0: "종이", 1: "종이팩", 2: "종이컵", 3: "캔", 4: "고철",
    5: "페트", 6: "플라스틱", 7: "비닐", 8: "유리", 9: "스티로폼",
    10: "건전지", 11: "형광등", 12: "의류", 13: "섬유", 14: "고무",
    15: "목재", 16: "도자기", 17: "가죽", 18: "사기그릇", 19: "벽돌",
    20: "콘크리트", 21: "타일", 22: "유리조각", 23: "음식물", 24: "동물사체",
    25: "배설물", 26: "주사기", 27: "약품", 28: "기타", 29: "residue"
}

KOR_TO_ENG = {
    "종이": "paper",
    "종이팩": "paper_pack",
    "종이컵": "paper_cup",
    "캔": "can",
    "고철": "can",
    "페트": "pet",
    "플라스틱": "plastic",
    "비닐": "vinyl",
    "유리": "glass",
    "유리조각": "glass",
    "스티로폼": "styrofoam",
    "건전지": "battery",
    "형광등": "fluorescent",
    "의류": "clothing",
    "섬유": "clothing",
    "고무": "rubber",
    "목재": "wood",
    "도자기": "pottery",
    "가죽": "leather",
    "사기그릇": "pottery",
    "벽돌": "construction_waste",
    "콘크리트": "construction_waste",
    "타일": "construction_waste",
    "음식물": "food_waste",
    "동물사체": "general_waste",
    "배설물": "general_waste",
    "주사기": "medical_waste",
    "약품": "medical_waste",
    "기타": "general_waste",
    "residue": "residue",
}

print("Loading AI Model...")
image_processor = AutoImageProcessor.from_pretrained(MODEL_PATH)
model = SwinForImageClassification.from_pretrained(MODEL_PATH)
model.eval()
print("AI Model Loaded Successfully!")


def analyze_waste_image(image_input):
    if isinstance(image_input, str):
        image = Image.open(image_input).convert("RGB")
    else:
        image = image_input.convert("RGB")

    inputs = image_processor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)

    # multi_label_classification → sigmoid (소프트맥스 아님)
    probs = torch.sigmoid(outputs.logits[0])

    detected_eng = []
    for idx, score in enumerate(probs.tolist()):
        if score > THRESHOLD:
            kor_label = ID_TO_LABEL.get(idx, "")
            eng_label = KOR_TO_ENG.get(kor_label, "")
            if eng_label:
                detected_eng.append(eng_label)

    detected_eng = list(set(detected_eng))

    return {
        "detected_waste": [{"class_name": item} for item in detected_eng if item != "residue"],
        "is_dirty": "residue" in detected_eng,
    }
