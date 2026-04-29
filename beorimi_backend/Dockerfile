FROM python:3.11-slim

WORKDIR /app

# torch/torchvision CPU 버전 (HF Spaces는 CPU 환경)
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# 모델 압축 해제
RUN python -c "import zipfile; zipfile.ZipFile('my_permanent_model.zip').extractall('.')"

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
